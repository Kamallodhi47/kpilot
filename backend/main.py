from fastapi import FastAPI, HTTPException, Depends, status, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import requests
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

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

app = FastAPI(title="KPilot AI - Meta Marketing Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)

class UserCreate(BaseModel):
    email: str
    password: str

def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
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

def fetch_meta_details(access_token: str):
    """Fetches user details and ad accounts using Meta Graph API."""
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

@app.get("/")
def read_root():
    return {"message": "Welcome to KPilot AI Backend - Meta Connected"}

@app.post("/api/auth/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    env_meta_token = os.getenv("META_ACCESS_TOKEN", "")
    
    account_id = None
    account_name = None
    if env_meta_token:
        try:
            details = fetch_meta_details(env_meta_token)
            account_id = details["account_id"]
            account_name = details["account_name"]
        except Exception:
            pass
    
    new_user = User(
        email=user.email,
        password_hash=hashed_password,
        meta_access_token=env_meta_token,
        meta_account_id=account_id,
        meta_account_name=account_name
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
    
    # Ensure user has current Meta token if none exists
    env_meta_token = os.getenv("META_ACCESS_TOKEN", "")
    if env_meta_token and not user.meta_access_token:
        try:
            details = fetch_meta_details(env_meta_token)
            user.meta_access_token = env_meta_token
            user.meta_account_id = details["account_id"]
            user.meta_account_name = details["account_name"]
            db.commit()
        except Exception:
            pass
            
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/meta/status")
def get_meta_status(current_user: Optional[User] = Depends(get_optional_user), db: Session = Depends(get_db)):
    env_token = os.getenv("META_ACCESS_TOKEN", "")
    active_token = (current_user.meta_access_token if current_user and current_user.meta_access_token else env_token)
    
    if not active_token:
        return {"connected": False, "account_name": None, "account_id": None, "ad_accounts": []}
    
    try:
        details = fetch_meta_details(active_token)
        if current_user and (current_user.meta_account_name != details["account_name"] or not current_user.meta_access_token):
            current_user.meta_access_token = active_token
            current_user.meta_account_id = details["account_id"]
            current_user.meta_account_name = details["account_name"]
            db.commit()
            
        return {
            "connected": True,
            "account_name": details["account_name"],
            "account_id": details["account_id"],
            "ad_accounts": details["ad_accounts"]
        }
    except Exception as e:
        return {"connected": False, "error": str(e), "ad_accounts": []}

@app.post("/api/meta/connect")
def connect_meta(current_user: Optional[User] = Depends(get_optional_user), db: Session = Depends(get_db)):
    env_token = os.getenv("META_ACCESS_TOKEN", "")
    active_token = (current_user.meta_access_token if current_user and current_user.meta_access_token else env_token)
    
    if not active_token:
        raise HTTPException(status_code=400, detail="No Meta access token configured.")
        
    details = fetch_meta_details(active_token)
    
    if current_user:
        current_user.meta_access_token = active_token
        current_user.meta_account_id = details["account_id"]
        current_user.meta_account_name = details["account_name"]
        db.commit()
    
    return {
        "success": True, 
        "message": f"Successfully connected to Meta as {details['account_name']}!",
        "account_name": details["account_name"],
        "account_id": details["account_id"],
        "ad_accounts": details["ad_accounts"]
    }

@app.get("/api/meta/adaccounts")
def get_meta_adaccounts(current_user: Optional[User] = Depends(get_optional_user)):
    env_token = os.getenv("META_ACCESS_TOKEN", "")
    active_token = (current_user.meta_access_token if current_user and current_user.meta_access_token else env_token)
    
    if not active_token:
        raise HTTPException(status_code=400, detail="Not connected to Meta")
        
    ad_url = f"https://graph.facebook.com/v19.0/me/adaccounts?fields=name,account_id,id,account_status,currency,amount_spent&access_token={active_token}"
    res = requests.get(ad_url)
    if res.status_code != 200:
        raise HTTPException(status_code=400, detail=res.text)
        
    return res.json()

@app.get("/api/meta/campaigns")
def get_meta_campaigns(account_id: Optional[str] = None, current_user: Optional[User] = Depends(get_optional_user)):
    env_token = os.getenv("META_ACCESS_TOKEN", "")
    active_token = (current_user.meta_access_token if current_user and current_user.meta_access_token else env_token)
    
    if not active_token:
        raise HTTPException(status_code=400, detail="Not connected to Meta")
        
    if not account_id:
        # Fetch first ad account
        ad_res = requests.get(f"https://graph.facebook.com/v19.0/me/adaccounts?access_token={active_token}")
        data = ad_res.json().get("data", [])
        if data:
            account_id = data[0]["id"]
        else:
            return {"data": []}
            
    if not account_id.startswith("act_"):
        account_id = f"act_{account_id}"
        
    url = f"https://graph.facebook.com/v19.0/{account_id}/campaigns?fields=id,name,status,objective,start_time,daily_budget,lifetime_budget&access_token={active_token}"
    res = requests.get(url)
    if res.status_code != 200:
        raise HTTPException(status_code=400, detail=res.text)
        
    return res.json()

@app.post("/api/meta/disconnect")
def disconnect_meta(current_user: Optional[User] = Depends(get_optional_user), db: Session = Depends(get_db)):
    if current_user:
        current_user.meta_access_token = None
        current_user.meta_account_id = None
        current_user.meta_account_name = None
        db.commit()
    return {"success": True, "message": "Disconnected from Meta"}

@app.get("/api/meta/oauth/url")
def get_meta_oauth_url():
    app_id = os.getenv("FB_APP_ID", "2603357056765357")
    redirect_uri = "https://adds.proteinsolution.in/meta/callback"
    scope = "ads_management,pages_show_list,pages_read_engagement"
    url = f"https://www.facebook.com/v19.0/dialog/oauth?client_id={app_id}&redirect_uri={redirect_uri}&scope={scope}"
    return {"url": url}

class OAuthCallback(BaseModel):
    code: str

@app.post("/api/meta/oauth/callback")
def meta_oauth_callback(payload: OAuthCallback, current_user: Optional[User] = Depends(get_optional_user), db: Session = Depends(get_db)):
    app_id = os.getenv("FB_APP_ID")
    app_secret = os.getenv("FB_APP_SECRET")
    redirect_uri = "https://adds.proteinsolution.in/meta/callback"
    
    token_url = f"https://graph.facebook.com/v19.0/oauth/access_token?client_id={app_id}&redirect_uri={redirect_uri}&client_secret={app_secret}&code={payload.code}"
    token_res = requests.get(token_url)
    if token_res.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get access token from Meta")
    
    token_data = token_res.json()
    access_token = token_data.get("access_token")
    
    details = fetch_meta_details(access_token)
    
    if current_user:
        current_user.meta_access_token = access_token
        current_user.meta_account_id = details["account_id"]
        current_user.meta_account_name = details["account_name"]
        db.commit()
    
    return {"success": True, "account_name": details["account_name"], "ad_accounts": details["ad_accounts"]}
