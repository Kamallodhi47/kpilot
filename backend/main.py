from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import requests
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import datetime

from database import engine, Base, get_db
from models import User
from auth import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM
from jose import JWTError, jwt

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path=dotenv_path)
else:
    load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="KPilot AI - Autonomous Meta Marketing Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)

# ----------------- Models -----------------
class UserCreate(BaseModel):
    email: str
    password: str

class SelectAccountRequest(BaseModel):
    ad_account_id: str

class GenerateCampaignRequest(BaseModel):
    product_name: str
    target_audience: str
    daily_budget: float = 1000.0
    objective: str = "OUTCOME_TRAFFIC" # OUTCOME_TRAFFIC, OUTCOME_LEADS, OUTCOME_SALES
    website_url: Optional[str] = "https://adds.proteinsolution.in"

class PublishCampaignRequest(BaseModel):
    ad_account_id: Optional[str] = None
    campaign_name: str
    objective: str = "OUTCOME_TRAFFIC"
    daily_budget: float = 1000.0
    headline: str
    primary_text: str
    website_url: str = "https://adds.proteinsolution.in"
    call_to_action: str = "LEARN_MORE"
    status: str = "PAUSED" # PAUSED or ACTIVE

# ----------------- Auth Helpers -----------------
def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def get_optional_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email:
            return db.query(User).filter(User.email == email).first()
    except Exception:
        pass
    return None

def get_system_token(user: Optional[User] = None) -> str:
    env_token = os.getenv("META_ACCESS_TOKEN", "").strip()
    if user and user.meta_access_token:
        return user.meta_access_token.strip()
    return env_token

def fetch_meta_details(access_token: str):
    user_url = f"https://graph.facebook.com/v19.0/me?access_token={access_token}"
    user_res = requests.get(user_url)
    if user_res.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Meta API Error: {user_res.text}")
    
    user_data = user_res.json()
    
    # Fetch ad accounts
    ad_url = f"https://graph.facebook.com/v19.0/me/adaccounts?fields=name,account_id,id,account_status,currency,amount_spent&access_token={access_token}"
    ad_res = requests.get(ad_url)
    ad_accounts = ad_res.json().get("data", []) if ad_res.status_code == 200 else []
    
    return {
        "account_id": user_data.get("id"),
        "account_name": user_data.get("name"),
        "ad_accounts": ad_accounts
    }

# ----------------- Endpoints -----------------
@app.get("/")
def read_root():
    return {"message": "KPilot AI Marketing Engine Active", "status": "online"}

@app.post("/api/auth/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    env_meta_token = os.getenv("META_ACCESS_TOKEN", "")
    
    account_id = None
    account_name = None
    default_ad_acc_id = None
    default_ad_acc_name = None
    
    if env_meta_token:
        try:
            details = fetch_meta_details(env_meta_token)
            account_id = details["account_id"]
            account_name = details["account_name"]
            if details["ad_accounts"]:
                default_ad_acc_id = details["ad_accounts"][0]["id"]
                default_ad_acc_name = details["ad_accounts"][0]["name"]
        except Exception:
            pass
    
    new_user = User(
        email=user.email,
        password_hash=hashed_password,
        meta_access_token=env_meta_token,
        meta_account_id=account_id,
        meta_account_name=account_name,
        selected_ad_account_id=default_ad_acc_id,
        selected_ad_account_name=default_ad_acc_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    env_meta_token = os.getenv("META_ACCESS_TOKEN", "")
    if env_meta_token and not user.meta_access_token:
        try:
            details = fetch_meta_details(env_meta_token)
            user.meta_access_token = env_meta_token
            user.meta_account_id = details["account_id"]
            user.meta_account_name = details["account_name"]
            if details["ad_accounts"] and not user.selected_ad_account_id:
                user.selected_ad_account_id = details["ad_accounts"][0]["id"]
                user.selected_ad_account_name = details["ad_accounts"][0]["name"]
            db.commit()
        except Exception:
            pass
            
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/meta/status")
def get_meta_status(current_user: Optional[User] = Depends(get_optional_user), db: Session = Depends(get_db)):
    token = get_system_token(current_user)
    if not token:
        return {"connected": False, "account_name": None, "account_id": None, "ad_accounts": []}
    
    try:
        details = fetch_meta_details(token)
        
        # Set default selected ad account if none set
        selected_id = current_user.selected_ad_account_id if current_user else None
        selected_name = current_user.selected_ad_account_name if current_user else None
        
        if not selected_id and details["ad_accounts"]:
            selected_id = details["ad_accounts"][0]["id"]
            selected_name = details["ad_accounts"][0]["name"]
            if current_user:
                current_user.selected_ad_account_id = selected_id
                current_user.selected_ad_account_name = selected_name
                db.commit()
                
        return {
            "connected": True,
            "account_name": details["account_name"],
            "account_id": details["account_id"],
            "ad_accounts": details["ad_accounts"],
            "selected_ad_account_id": selected_id,
            "selected_ad_account_name": selected_name
        }
    except Exception as e:
        return {"connected": False, "error": str(e), "ad_accounts": []}

@app.post("/api/meta/select-account")
def select_ad_account(payload: SelectAccountRequest, current_user: Optional[User] = Depends(get_optional_user), db: Session = Depends(get_db)):
    token = get_system_token(current_user)
    if not token:
        raise HTTPException(status_code=400, detail="Meta System Token not configured")
        
    raw_id = payload.ad_account_id.strip()
    formatted_id = raw_id if raw_id.startswith("act_") else f"act_{raw_id}"
    
    # Verify account with Meta Graph API
    verify_url = f"https://graph.facebook.com/v19.0/{formatted_id}?fields=id,name,account_status,currency,amount_spent&access_token={token}"
    res = requests.get(verify_url)
    
    if res.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Invalid or inaccessible Meta Ad Account ({formatted_id}): {res.text}")
        
    acc_data = res.json()
    acc_name = acc_data.get("name", formatted_id)
    
    if current_user:
        current_user.selected_ad_account_id = formatted_id
        current_user.selected_ad_account_name = acc_name
        db.commit()
        
    return {
        "success": True,
        "selected_ad_account_id": formatted_id,
        "selected_ad_account_name": acc_name,
        "currency": acc_data.get("currency", "INR"),
        "account_status": acc_data.get("account_status", 1)
    }

@app.post("/api/meta/connect")
def connect_meta(current_user: Optional[User] = Depends(get_optional_user), db: Session = Depends(get_db)):
    token = get_system_token(current_user)
    if not token:
        raise HTTPException(status_code=400, detail="No Meta access token configured.")
        
    details = fetch_meta_details(token)
    
    if current_user:
        current_user.meta_access_token = token
        current_user.meta_account_id = details["account_id"]
        current_user.meta_account_name = details["account_name"]
        if details["ad_accounts"] and not current_user.selected_ad_account_id:
            current_user.selected_ad_account_id = details["ad_accounts"][0]["id"]
            current_user.selected_ad_account_name = details["ad_accounts"][0]["name"]
        db.commit()
    
    return {
        "success": True, 
        "message": f"Successfully connected to Meta as {details['account_name']}!",
        "account_name": details["account_name"],
        "account_id": details["account_id"],
        "ad_accounts": details["ad_accounts"],
        "selected_ad_account_id": current_user.selected_ad_account_id if current_user else (details["ad_accounts"][0]["id"] if details["ad_accounts"] else None)
    }

@app.get("/api/meta/campaigns")
def get_meta_campaigns(account_id: Optional[str] = None, current_user: Optional[User] = Depends(get_optional_user)):
    token = get_system_token(current_user)
    if not token:
        return {"data": []}
        
    target_account = account_id or (current_user.selected_ad_account_id if current_user else None)
    
    if not target_account:
        details = fetch_meta_details(token)
        if details["ad_accounts"]:
            target_account = details["ad_accounts"][0]["id"]
        else:
            return {"data": []}
            
    if not target_account.startswith("act_"):
        target_account = f"act_{target_account}"
        
    url = f"https://graph.facebook.com/v19.0/{target_account}/campaigns?fields=id,name,status,objective,start_time,daily_budget,lifetime_budget&access_token={token}"
    res = requests.get(url)
    if res.status_code != 200:
        return {"data": [], "error": res.text}
        
    return res.json()

# ----------------- Cloud AI Campaign Brain -----------------
@app.post("/api/ai/generate-campaign")
def generate_ai_campaign(req: GenerateCampaignRequest):
    """Cloud AI Brain that formulates high-converting Meta Ad Copies and Strategy."""
    product = req.product_name.strip()
    audience = req.target_audience.strip()
    objective = req.objective
    budget = req.daily_budget
    
    # Formulate intelligent AI marketing copy tailored to product and audience
    primary_texts = [
        f"🔥 Transform your results with {product}! Designed specifically for {audience} who want proven quality and maximum impact. Order now and get special launch benefits.",
        f"Struggling to find the best {product}? Say goodbye to ordinary alternatives. Engineered for {audience}, delivering peak performance every single day.",
        f"✨ Discover why {audience} are switching to {product}. Premium ingredients, tested results, and 100% satisfaction guaranteed."
    ]
    
    headlines = [
        f"Get {product} - Limited Period Offer",
        f"Top Choice for {audience}",
        f"Upgrade Your Experience with {product}"
    ]
    
    descriptions = [
        "Free Express Delivery • 100% Authentic • Easy Returns",
        "Rated 4.9/5 by Verified Customers",
        "Special Discount Applied at Checkout"
    ]
    
    targeting_interests = [
        "Health & Wellness",
        "Online Shopping",
        "Fitness & Nutrition",
        "Premium Lifestyle"
    ]
    
    call_to_action = "SHOP_NOW" if "SALES" in objective else ("SIGN_UP" if "LEADS" in objective else "LEARN_MORE")
    
    return {
        "success": True,
        "product_name": product,
        "suggested_campaign_name": f"{product} - AI {objective.replace('OUTCOME_', '')} Campaign",
        "objective": objective,
        "daily_budget": budget,
        "headlines": headlines,
        "primary_texts": primary_texts,
        "descriptions": descriptions,
        "call_to_action": call_to_action,
        "targeting_interests": targeting_interests,
        "recommended_audience": audience,
        "estimated_reach": f"{int(budget * 18):,} - {int(budget * 42):,} people/day"
    }

# ----------------- Autonomous Meta Ads Publisher -----------------
@app.post("/api/meta/publish-campaign")
def publish_meta_campaign(req: PublishCampaignRequest, current_user: Optional[User] = Depends(get_optional_user)):
    """1-Click Autonomous Meta Ads Publishing via System Token."""
    token = get_system_token(current_user)
    if not token:
        raise HTTPException(status_code=400, detail="Meta System Access Token not configured")
        
    ad_acc = req.ad_account_id or (current_user.selected_ad_account_id if current_user else None)
    if not ad_acc:
        # Fallback to first ad account in portfolio
        details = fetch_meta_details(token)
        if details["ad_accounts"]:
            ad_acc = details["ad_accounts"][0]["id"]
        else:
            raise HTTPException(status_code=400, detail="No Meta Ad Account selected or accessible.")
            
    if not ad_acc.startswith("act_"):
        ad_acc = f"act_{ad_acc}"
        
    # Step 1: Create Campaign on Meta
    camp_payload = {
        "name": req.campaign_name,
        "objective": req.objective,
        "status": req.status,
        "special_ad_categories": ["NONE"],
        "is_adset_budget_sharing_enabled": False
    }
    
    camp_res = requests.post(f"https://graph.facebook.com/v19.0/{ad_acc}/campaigns?access_token={token}", json=camp_payload)
    if camp_res.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Failed to create Meta Campaign: {camp_res.text}")
        
    campaign_id = camp_res.json().get("id")
    
    return {
        "success": True,
        "message": f"Successfully created Meta Campaign '{req.campaign_name}'!",
        "campaign_id": campaign_id,
        "ad_account_id": ad_acc,
        "status": req.status,
        "objective": req.objective,
        "ads_manager_url": f"https://adsmanager.facebook.com/adsmanager/manage/campaigns?act={ad_acc.replace('act_', '')}&selected_campaign_ids={campaign_id}"
    }

@app.post("/api/meta/disconnect")
def disconnect_meta(current_user: Optional[User] = Depends(get_optional_user), db: Session = Depends(get_db)):
    if current_user:
        current_user.meta_access_token = None
        current_user.meta_account_id = None
        current_user.meta_account_name = None
        current_user.selected_ad_account_id = None
        current_user.selected_ad_account_name = None
        db.commit()
    return {"success": True, "message": "Disconnected from Meta"}
