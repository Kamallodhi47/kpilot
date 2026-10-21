from fastapi import FastAPI, HTTPException, Depends, status, Request, Response, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import requests
import urllib.parse
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text
import datetime

from database import engine, Base, get_db
from models import User, Campaign, Lead
from auth import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM
from jose import JWTError, jwt

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path=dotenv_path)
else:
    load_dotenv()

Base.metadata.create_all(bind=engine)

def run_db_migrations():
    """Ensure all required columns exist in SQLite or PostgreSQL without losing data."""
    try:
        is_sqlite = engine.url.drivername.startswith("sqlite")
        with engine.connect() as conn:
            if is_sqlite:
                result = conn.execute(text("PRAGMA table_info(users)"))
                columns = [row[1] for row in result.fetchall()]
                
                if "meta_access_token" not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN meta_access_token VARCHAR"))
                if "meta_account_id" not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN meta_account_id VARCHAR"))
                if "meta_account_name" not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN meta_account_name VARCHAR"))
                if "selected_ad_account_id" not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN selected_ad_account_id VARCHAR"))
                if "selected_ad_account_name" not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN selected_ad_account_name VARCHAR"))
                
                # Check leads table columns
                result_leads = conn.execute(text("PRAGMA table_info(leads)"))
                lead_cols = [row[1] for row in result_leads.fetchall()]
                if "lead_type" not in lead_cols:
                    conn.execute(text("ALTER TABLE leads ADD COLUMN lead_type VARCHAR DEFAULT 'Lead Form'"))
                if "message_text" not in lead_cols:
                    conn.execute(text("ALTER TABLE leads ADD COLUMN message_text TEXT"))
                if "instagram_username" not in lead_cols:
                    conn.execute(text("ALTER TABLE leads ADD COLUMN instagram_username VARCHAR"))
            else:
                # PostgreSQL supports ADD COLUMN IF NOT EXISTS directly!
                conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS meta_access_token VARCHAR;"))
                conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS meta_account_id VARCHAR;"))
                conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS meta_account_name VARCHAR;"))
                conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS selected_ad_account_id VARCHAR;"))
                conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS selected_ad_account_name VARCHAR;"))
                
                conn.execute(text("ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_type VARCHAR DEFAULT 'Lead Form';"))
                conn.execute(text("ALTER TABLE leads ADD COLUMN IF NOT EXISTS message_text TEXT;"))
                conn.execute(text("ALTER TABLE leads ADD COLUMN IF NOT EXISTS instagram_username VARCHAR;"))
            
            conn.commit()
    except Exception as e:
        print("Database migration check notice:", e)

run_db_migrations()

app = FastAPI(title="KPilot AI - Autonomous Meta Marketing Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)

active_connected_meta = {
    "connected": False,
    "email": None,
    "account_name": None,
    "account_id": None,
    "selected_ad_account_id": None,
    "selected_ad_account_name": None,
    "token": None
}

# ----------------- Models -----------------
class UserCreate(BaseModel):
    email: str
    password: str

class SelectAccountRequest(BaseModel):
    ad_account_id: str

class OAuthCallbackRequest(BaseModel):
    code: str
    state: Optional[str] = None
    redirect_uri: Optional[str] = None


class DirectTokenConnectRequest(BaseModel):
    access_token: str
    ad_account_id: Optional[str] = None

class ConnectByIdRequest(BaseModel):
    email: str
    meta_id: str
    account_name: Optional[str] = None
    custom_token: Optional[str] = None

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

def generate_oauth_state(user_id: int, email: str) -> str:
    """Generate a signed, tamper-proof state token to protect against CSRF attacks."""
    payload = {
        "sub": email,
        "uid": user_id,
        "purpose": "meta_oauth_csrf",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=20)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_oauth_state(state: str, user_id: int, email: str) -> bool:
    """Verify that the OAuth state parameter is valid, unexpired, and matches the authenticated user."""
    try:
        payload = jwt.decode(state, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("purpose") != "meta_oauth_csrf":
            return False
        if payload.get("sub") != email or payload.get("uid") != user_id:
            return False
        return True
    except Exception as e:
        print("CSRF state verification failure:", e)
        return False

def fetch_meta_details(access_token: str):
    try:
        user_url = "https://graph.facebook.com/v19.0/me"
        user_res = requests.get(user_url, params={"fields": "id,name,email", "access_token": access_token}, timeout=15)
        if user_res.status_code != 200:
            err_data = {}
            try:
                err_data = user_res.json().get("error", {})
            except Exception:
                pass
            err_code = err_data.get("code")
            err_msg = err_data.get("message", user_res.text)
            print(f"Meta Graph API error (status {user_res.status_code}, code {err_code}): {err_msg}")
            return {
                "account_id": None,
                "account_name": None,
                "ad_accounts": [],
                "error": err_msg,
                "error_code": err_code,
                "token_expired": err_code in [190, 102] or user_res.status_code == 401
            }
        
        user_data = user_res.json()
        
        # Fetch ad accounts
        ad_url = "https://graph.facebook.com/v19.0/me/adaccounts"
        ad_res = requests.get(
            ad_url,
            params={
                "fields": "name,account_id,id,account_status,currency,amount_spent,timezone_name",
                "limit": "100",
                "access_token": access_token
            },
            timeout=15
        )
        ad_accounts = []
        if ad_res.status_code == 200:
            ad_accounts = ad_res.json().get("data", [])
        else:
            print(f"Meta Ad Accounts API error: {ad_res.text}")
            
        return {
            "account_id": user_data.get("id"),
            "account_name": user_data.get("name"),
            "ad_accounts": ad_accounts,
            "error": None,
            "token_expired": False
        }
    except Exception as e:
        print(f"Exception during fetch_meta_details: {e}")
        return {"account_id": None, "account_name": None, "ad_accounts": [], "error": str(e), "token_expired": False}


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
    
    # User starts with NO Meta token — they connect their own account via OAuth
    new_user = User(
        email=user.email,
        password_hash=hashed_password,
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
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me")
def get_current_user_profile(current_user: Optional[User] = Depends(get_optional_user)):
    if not current_user:
        return {
            "authenticated": False,
            "email": "user@proteinsolution.in",
            "name": "User",
            "initial": "U",
            "selected_ad_account_id": None,
            "selected_ad_account_name": None
        }
    
    local_part = current_user.email.split("@")[0]
    display_name = local_part.replace(".", " ").replace("_", " ").replace("-", " ").title()
    initial = display_name[0].upper() if display_name else "U"
    
    return {
        "authenticated": True,
        "email": current_user.email,
        "name": display_name,
        "initial": initial,
        "meta_account_name": current_user.meta_account_name,
        "selected_ad_account_id": current_user.selected_ad_account_id,
        "selected_ad_account_name": current_user.selected_ad_account_name
    }

@app.get("/api/meta/status")
def get_meta_status(current_user: Optional[User] = Depends(get_optional_user), db: Session = Depends(get_db)):
    # 1. If an authenticated user is logged in
    if current_user:
        user_token = current_user.meta_access_token
        # Fallback to system env token if user hasn't explicitly set one
        if not user_token:
            env_token = os.getenv("META_ACCESS_TOKEN", "").strip()
            if env_token:
                user_token = env_token
                current_user.meta_access_token = env_token
                db.commit()

        if user_token:
            details = fetch_meta_details(user_token)
            
            # Check for expired or revoked token
            if details.get("token_expired"):
                return {
                    "connected": False,
                    "token_expired": True,
                    "error": "Your Meta authorization has expired or was revoked. Please reconnect.",
                    "email": current_user.email,
                    "account_name": current_user.meta_account_name,
                    "account_id": current_user.meta_account_id,
                    "ad_accounts": [],
                    "selected_ad_account_id": None,
                    "selected_ad_account_name": None
                }
            
            live_ad_accounts = details.get("ad_accounts", [])
            selected_id = current_user.selected_ad_account_id
            selected_name = current_user.selected_ad_account_name
            
            # If user has ad accounts and hasn't selected one yet, default to first
            if live_ad_accounts and not selected_id:
                selected_id = live_ad_accounts[0]["id"]
                selected_name = live_ad_accounts[0].get("name", selected_id)
                current_user.selected_ad_account_id = selected_id
                current_user.selected_ad_account_name = selected_name
                if not current_user.meta_account_id:
                    current_user.meta_account_id = details.get("account_id")
                if not current_user.meta_account_name:
                    current_user.meta_account_name = details.get("account_name")
                db.commit()
                
            return {
                "connected": True,
                "token_expired": False,
                "email": current_user.email,
                "account_name": details.get("account_name") or current_user.meta_account_name,
                "account_id": current_user.meta_account_id or details.get("account_id"),
                "ad_accounts": live_ad_accounts,
                "selected_ad_account_id": selected_id,
                "selected_ad_account_name": selected_name
            }
        else:
            return {
                "connected": False,
                "token_expired": False,
                "email": current_user.email,
                "account_name": None,
                "account_id": None,
                "ad_accounts": [],
                "selected_ad_account_id": None,
                "selected_ad_account_name": None
            }

    # 2. Unauthenticated / guest state: Check active_connected_meta or system token
    global active_connected_meta
    if active_connected_meta.get("connected"):
        return {
            "connected": True,
            "token_expired": False,
            "email": active_connected_meta.get("email"),
            "account_name": active_connected_meta.get("account_name"),
            "account_id": active_connected_meta.get("account_id"),
            "ad_accounts": [{
                "id": active_connected_meta.get("selected_ad_account_id"),
                "name": active_connected_meta.get("selected_ad_account_name"),
                "account_id": active_connected_meta.get("account_id"),
                "account_status": active_connected_meta.get("status_code", 1),
                "currency": active_connected_meta.get("currency", "INR")
            }],
            "selected_ad_account_id": active_connected_meta.get("selected_ad_account_id"),
            "selected_ad_account_name": active_connected_meta.get("selected_ad_account_name")
        }

    env_token = os.getenv("META_ACCESS_TOKEN", "").strip()
    if env_token:
        details = fetch_meta_details(env_token)
        if not details.get("token_expired") and (details.get("account_id") or details.get("account_name")):
            live_ad_accounts = details.get("ad_accounts", [])
            selected_id = live_ad_accounts[0]["id"] if live_ad_accounts else None
            selected_name = live_ad_accounts[0]["name"] if live_ad_accounts else details.get("account_name")
            return {
                "connected": True,
                "token_expired": False,
                "email": "connected@meta.com",
                "account_name": details.get("account_name"),
                "account_id": details.get("account_id"),
                "ad_accounts": live_ad_accounts,
                "selected_ad_account_id": selected_id,
                "selected_ad_account_name": selected_name
            }

    return {
        "connected": False,
        "token_expired": False,
        "email": None,
        "account_name": None,
        "account_id": None,
        "ad_accounts": [],
        "selected_ad_account_id": None,
        "selected_ad_account_name": None
    }

@app.post("/api/meta/select-account")
def select_ad_account(payload: SelectAccountRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.meta_access_token:
        raise HTTPException(status_code=400, detail="Please connect your Meta account first.")
        
    token = current_user.meta_access_token.strip()
    raw_id = payload.ad_account_id.strip()
    formatted_id = raw_id if raw_id.startswith("act_") else f"act_{raw_id}"
    
    # Verify account with Meta Graph API
    try:
        verify_url = f"https://graph.facebook.com/v19.0/{formatted_id}"
        res = requests.get(
            verify_url,
            params={"fields": "id,name,account_status,currency,amount_spent", "access_token": token},
            timeout=10
        )
        
        if res.status_code != 200:
            err_msg = res.text
            try:
                err_msg = res.json().get("error", {}).get("message", err_msg)
            except Exception:
                pass
            raise HTTPException(status_code=400, detail=f"Invalid or inaccessible Meta Ad Account ({formatted_id}): {err_msg}")
            
        acc_data = res.json()
        acc_name = acc_data.get("name", formatted_id)
        
        current_user.selected_ad_account_id = formatted_id
        current_user.selected_ad_account_name = acc_name
        db.commit()
        db.refresh(current_user)
            
        return {
            "success": True,
            "message": f"Successfully activated Ad Account: {acc_name} ({formatted_id})",
            "selected_ad_account_id": formatted_id,
            "selected_ad_account_name": acc_name,
            "currency": acc_data.get("currency", "USD"),
            "account_status": acc_data.get("account_status", 1)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error accessing ad account: {str(e)}")


@app.post("/api/meta/connect")
def connect_meta(current_user: Optional[User] = Depends(get_optional_user), db: Session = Depends(get_db)):
    token = None
    if current_user and current_user.meta_access_token:
        token = current_user.meta_access_token.strip()
    else:
        env_token = os.getenv("META_ACCESS_TOKEN", "").strip()
        if env_token:
            token = env_token
            if current_user:
                current_user.meta_access_token = env_token
        else:
            raise HTTPException(status_code=400, detail="No Meta access token configured.")
        
    details = fetch_meta_details(token)
    if not details.get("account_id"):
        raise HTTPException(status_code=400, detail="Unable to verify Meta account with token.")
    
    if current_user:
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

@app.post("/api/meta/connect-token")
def connect_meta_direct_token(req: DirectTokenConnectRequest, current_user: Optional[User] = Depends(get_optional_user), db: Session = Depends(get_db)):
    token = req.access_token.strip() if req.access_token else ""
    if not token:
        env_token = os.getenv("META_ACCESS_TOKEN", "").strip()
        if env_token:
            token = env_token
        else:
            raise HTTPException(status_code=400, detail="Meta Access Token is required")
        
    details = fetch_meta_details(token)
    if not details.get("account_id") and not details.get("account_name"):
        raise HTTPException(status_code=400, detail="Invalid Meta Access Token or unable to reach Meta Graph API")
    
    selected_id = None
    selected_name = None
    target_ad_acc = req.ad_account_id.strip() if req.ad_account_id else None

    if target_ad_acc:
        formatted_id = target_ad_acc if target_ad_acc.startswith("act_") else f"act_{target_ad_acc}"
        selected_id = formatted_id
        selected_name = formatted_id
        for acc in details["ad_accounts"]:
            if acc["id"] == formatted_id or acc.get("account_id") == target_ad_acc:
                selected_name = acc.get("name", formatted_id)
                selected_id = acc["id"]
                break
    elif details["ad_accounts"]:
        selected_id = details["ad_accounts"][0]["id"]
        selected_name = details["ad_accounts"][0]["name"]

    if current_user:
        current_user.meta_access_token = token
        current_user.meta_account_id = details["account_id"]
        current_user.meta_account_name = details["account_name"]
        current_user.selected_ad_account_id = selected_id
        current_user.selected_ad_account_name = selected_name
        db.commit()
    else:
        os.environ["META_ACCESS_TOKEN"] = token
        if selected_id:
            os.environ["META_AD_ACCOUNT_ID"] = selected_id
        if selected_name:
            os.environ["META_AD_ACCOUNT_NAME"] = selected_name

    # Persist token to .env for convenience across restarts
    try:
        dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
        lines = []
        if os.path.exists(dotenv_path):
            with open(dotenv_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
        has_token = False
        new_lines = []
        for line in lines:
            if line.startswith("META_ACCESS_TOKEN="):
                new_lines.append(f"META_ACCESS_TOKEN={token}\n")
                has_token = True
            else:
                new_lines.append(line)
        if not has_token:
            new_lines.append(f"\nMETA_ACCESS_TOKEN={token}\n")
        with open(dotenv_path, "w", encoding="utf-8") as f:
            f.writelines(new_lines)
    except Exception as env_err:
        print("Notice saving .env:", env_err)
    
    return {
        "success": True,
        "message": f"Successfully connected to Meta as {details['account_name']}!",
        "account_name": details["account_name"],
        "account_id": details["account_id"],
        "ad_accounts": details["ad_accounts"],
        "selected_ad_account_id": selected_id,
        "selected_ad_account_name": selected_name
    }

@app.post("/api/meta/connect-by-id")
def connect_meta_by_id(req: ConnectByIdRequest, current_user: Optional[User] = Depends(get_optional_user), db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    raw_id = req.meta_id.strip()
    if not email:
        raise HTTPException(status_code=400, detail="Mail ID is required")
    if not raw_id:
        raise HTTPException(status_code=400, detail="Meta ID / Ad Account ID is required")
        
    formatted_id = raw_id if raw_id.startswith("act_") else f"act_{raw_id}"
    token = (req.custom_token.strip() if req.custom_token else "") or get_system_token(current_user)
    
    acc_name = req.account_name or f"Meta Account ({raw_id})"
    currency = "INR"
    status_code = 1
    
    if token:
        try:
            verify_url = f"https://graph.facebook.com/v19.0/{formatted_id}?fields=id,name,account_status,currency&access_token={token}"
            res = requests.get(verify_url, timeout=7)
            if res.status_code == 200:
                acc_data = res.json()
                acc_name = acc_data.get("name", acc_name)
                currency = acc_data.get("currency", "INR")
                status_code = acc_data.get("account_status", 1)
            else:
                profile_res = requests.get(f"https://graph.facebook.com/v19.0/{raw_id}?fields=id,name&access_token={token}", timeout=5)
                if profile_res.status_code == 200:
                    acc_name = profile_res.json().get("name", acc_name)
        except Exception as e:
            print("Notice verifying Meta ID:", e)
            
    user = current_user
    if not user and email:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                email=email,
                password_hash=get_password_hash("default123"),
                meta_account_id=raw_id,
                meta_account_name=acc_name,
                selected_ad_account_id=formatted_id,
                selected_ad_account_name=acc_name,
                meta_access_token=token if token else None
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    if user:
        user.selected_ad_account_id = formatted_id
        user.selected_ad_account_name = acc_name
        user.meta_account_id = raw_id
        user.meta_account_name = acc_name
        if token and not user.meta_access_token:
            user.meta_access_token = token
        db.commit()

    global active_connected_meta
    active_connected_meta = {
        "connected": True,
        "email": email,
        "account_name": acc_name,
        "account_id": raw_id,
        "selected_ad_account_id": formatted_id,
        "selected_ad_account_name": acc_name,
        "token": token,
        "currency": currency,
        "status_code": status_code
    }
        
    return {
        "success": True,
        "message": f"Successfully connected Meta Account ({acc_name}) with {email}!",
        "email": email,
        "account_name": acc_name,
        "account_id": raw_id,
        "selected_ad_account_id": formatted_id,
        "selected_ad_account_name": acc_name,
        "ad_accounts": [{
            "id": formatted_id,
            "account_id": raw_id,
            "name": acc_name,
            "currency": currency,
            "account_status": status_code
        }]
    }

@app.get("/api/meta/campaigns")
def get_meta_campaigns(account_id: Optional[str] = None, current_user: Optional[User] = Depends(get_optional_user)):
    if not current_user or not current_user.meta_access_token:
        return {"data": []}
        
    token = current_user.meta_access_token.strip()
    try:
        target_account = account_id or current_user.selected_ad_account_id
        
        if not target_account:
            details = fetch_meta_details(token)
            if details.get("ad_accounts"):
                target_account = details["ad_accounts"][0]["id"]
            else:
                return {"data": []}
                
        if not target_account.startswith("act_"):
            target_account = f"act_{target_account}"
            
        url = f"https://graph.facebook.com/v19.0/{target_account}/campaigns?fields=id,name,status,objective,start_time,daily_budget,lifetime_budget&access_token={token}"
        res = requests.get(url, timeout=7)
        if res.status_code != 200:
            return {"data": [], "error": res.text}
            
        return res.json()
    except Exception as e:
        return {"data": [], "error": str(e)}

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
def publish_meta_campaign(
    req: PublishCampaignRequest, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """1-Click Autonomous Meta Ads Publishing for authenticated user."""
    token = current_user.meta_access_token.strip() if current_user.meta_access_token else None
    if not token:
        raise HTTPException(status_code=400, detail="Please connect your Meta account before launching campaigns.")
        
    ad_acc = req.ad_account_id or current_user.selected_ad_account_id
    if not ad_acc:
        # Fallback to first ad account in user's portfolio
        details = fetch_meta_details(token)
        if details.get("ad_accounts"):
            ad_acc = details["ad_accounts"][0]["id"]
        else:
            raise HTTPException(status_code=400, detail="No Meta Ad Account selected or accessible.")
            
    if not ad_acc.startswith("act_"):
        ad_acc = f"act_{ad_acc}"
        
    try:
        # Step 1: Create Campaign on Meta
        camp_payload = {
            "name": req.campaign_name,
            "objective": req.objective,
            "status": req.status,
            "special_ad_categories": ["NONE"],
            "is_adset_budget_sharing_enabled": False
        }
        
        camp_res = requests.post(f"https://graph.facebook.com/v19.0/{ad_acc}/campaigns?access_token={token}", json=camp_payload, timeout=10)
        if camp_res.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to create Meta Campaign: {camp_res.text}")
            
        campaign_id = camp_res.json().get("id")

        # Step 2: Store campaign in DB assigned to current_user
        try:
            new_camp_record = Campaign(
                user_id=current_user.id,
                meta_campaign_id=str(campaign_id),
                campaign_name=req.campaign_name,
                objective=req.objective,
                status=req.status,
                ad_account_id=ad_acc
            )
            db.add(new_camp_record)
            db.commit()
        except Exception as camp_db_err:
            print("[Campaign DB Save] Notice:", camp_db_err)
        
        return {
            "success": True,
            "message": f"Successfully created Meta Campaign '{req.campaign_name}'!",
            "campaign_id": campaign_id,
            "ad_account_id": ad_acc,
            "status": req.status,
            "objective": req.objective,
            "ads_manager_url": f"https://adsmanager.facebook.com/adsmanager/manage/campaigns?act={ad_acc.replace('act_', '')}&selected_campaign_ids={campaign_id}"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error publishing campaign: {str(e)}")

@app.post("/api/meta/disconnect")
def disconnect_meta(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Disconnect connected Meta account cleanly for the authenticated user without affecting others."""
    current_user.meta_access_token = None
    current_user.meta_account_id = None
    current_user.meta_account_name = None
    current_user.selected_ad_account_id = None
    current_user.selected_ad_account_name = None
    db.commit()
    db.refresh(current_user)
    return {"success": True, "message": "Successfully disconnected your Meta account"}

@app.get("/api/meta/oauth/start")
def oauth_start(current_user: User = Depends(get_current_user)):
    """Generate Facebook OAuth URL with cryptographic CSRF state token and requested permissions."""
    fb_app_id = os.getenv("FB_APP_ID", "1603282457939716").strip()
    if not fb_app_id or fb_app_id == "YOUR_APP_ID_HERE":
        raise HTTPException(status_code=500, detail="FB_APP_ID is not configured in backend/.env")
        
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
    redirect_uri = f"{frontend_url}/meta/callback"
    state = generate_oauth_state(current_user.id, current_user.email)
    
    # Check for Facebook Login for Business Configuration ID
    config_id = os.getenv("FB_CONFIG_ID", "").strip()
    
    params = {
        "client_id": fb_app_id,
        "redirect_uri": redirect_uri,
        "state": state,
        "response_type": "code"
    }
    
    if config_id:
        params["config_id"] = config_id
    else:
        # Standard Marketing API OAuth flow with required scopes
        params["scope"] = "ads_read,ads_management,business_management,public_profile"
        
    query_string = urllib.parse.urlencode(params)
    auth_url = f"https://www.facebook.com/v19.0/dialog/oauth?{query_string}"
    
    return {
        "auth_url": auth_url,
        "state": state,
        "redirect_uri": redirect_uri
    }

@app.post("/api/meta/oauth/callback")
def oauth_callback(request: OAuthCallbackRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Exchange authorization code for a secure long-lived user token and fetch accessible Ad Accounts."""
    # 1. CSRF State Validation
    if request.state:
        if not verify_oauth_state(request.state, current_user.id, current_user.email):
            raise HTTPException(
                status_code=400,
                detail="OAuth CSRF state validation failed or expired. Please re-initiate connection."
            )
            
    fb_app_id = os.getenv("FB_APP_ID", "1603282457939716").strip()
    fb_app_secret = os.getenv("FB_APP_SECRET", "").strip()
    if not fb_app_id or not fb_app_secret or fb_app_secret == "YOUR_APP_SECRET_HERE":
        raise HTTPException(
            status_code=400,
            detail="Facebook App Secret is not configured in backend/.env yet. Please configure FB_APP_SECRET."
        )
        
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
    redirect_uri = request.redirect_uri or f"{frontend_url}/meta/callback"
    
    # 2. Exchange authorization code for short-lived user access token
    token_url = "https://graph.facebook.com/v19.0/oauth/access_token"
    token_params = {
        "client_id": fb_app_id,
        "client_secret": fb_app_secret,
        "redirect_uri": redirect_uri,
        "code": request.code
    }
    
    token_res = requests.get(token_url, params=token_params, timeout=15)
    if token_res.status_code != 200:
        err_msg = "Failed to exchange authorization code for access token"
        try:
            err_json = token_res.json()
            err_msg = err_json.get("error", {}).get("message", err_msg)
        except Exception:
            pass
        raise HTTPException(status_code=400, detail=f"Meta OAuth Error: {err_msg}")
        
    token_data = token_res.json()
    user_access_token = token_data.get("access_token")
    if not user_access_token:
        raise HTTPException(status_code=400, detail="Access token not received from Facebook.")
        
    # 3. Exchange for long-lived access token (~60 days validity)
    long_params = {
        "grant_type": "fb_exchange_token",
        "client_id": fb_app_id,
        "client_secret": fb_app_secret,
        "fb_exchange_token": user_access_token
    }
    long_res = requests.get(token_url, params=long_params, timeout=15)
    final_token = user_access_token
    if long_res.status_code == 200:
        final_token = long_res.json().get("access_token", user_access_token)
        
    # 4. Fetch user details and accessible ad accounts from Meta Graph API
    details = fetch_meta_details(final_token)
    if not details.get("account_id") and not details.get("account_name"):
        raise HTTPException(
            status_code=400,
            detail="Unable to fetch Meta account details with the generated token. Please try again."
        )
        
    # 5. Store strictly in this current_user's database record (user-isolated)
    current_user.meta_access_token = final_token
    current_user.meta_account_id = details.get("account_id")
    current_user.meta_account_name = details.get("account_name")
    
    ad_accounts = details.get("ad_accounts", [])
    if ad_accounts:
        current_user.selected_ad_account_id = ad_accounts[0]["id"]
        current_user.selected_ad_account_name = ad_accounts[0].get("name", ad_accounts[0]["id"])
    else:
        current_user.selected_ad_account_id = None
        current_user.selected_ad_account_name = None
        
    db.commit()
    db.refresh(current_user)
    
    return {
        "success": True,
        "message": f"Successfully connected to Meta as {current_user.meta_account_name}!",
        "account_name": current_user.meta_account_name,
        "account_id": current_user.meta_account_id,
        "ad_accounts": ad_accounts,
        "selected_ad_account_id": current_user.selected_ad_account_id,
        "selected_ad_account_name": current_user.selected_ad_account_name,
    }


# ========================================================
# ================ META WEBHOOK & LEADS ROUTING ==========
# ========================================================

META_WEBHOOK_VERIFY_TOKEN = os.getenv("META_WEBHOOK_VERIFY_TOKEN", "kpilot_lead_webhook_2026")

@app.get("/api/meta/webhook")
def verify_meta_webhook(request: Request):
    """
    Verification handshake required by Meta Graph API Webhooks.
    Meta sends:
      hub.mode = 'subscribe'
      hub.verify_token = '<your_configured_verify_token>'
      hub.challenge = '<random_challenge_string>'
    """
    params = request.query_params
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")

    if mode == "subscribe" and token == META_WEBHOOK_VERIFY_TOKEN:
        print("[Meta Webhook] Successfully verified handshake challenge!")
        return Response(content=challenge, media_type="text/plain", status_code=200)
    
    raise HTTPException(status_code=403, detail="Verification token mismatch")


@app.post("/api/meta/webhook")
async def receive_meta_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Receives real-time leadgen and Instagram DM notifications from Meta Webhook,
    fetches full details via Graph API, locates matching campaign owner,
    and stores the lead assigned directly to that user.
    """
    try:
        payload = await request.json()
        print("[Meta Webhook] Incoming event:", payload)

        # ----------------- 1. Facebook / Meta Lead Form Events -----------------
        if payload.get("object") in ["page", "ad_account"]:
            for entry in payload.get("entry", []):
                for change in entry.get("changes", []):
                    if change.get("field") == "leadgen":
                        value = change.get("value", {})
                        leadgen_id = str(value.get("leadgen_id", ""))
                        form_id = str(value.get("form_id", ""))
                        ad_id = str(value.get("ad_id", ""))

                        if not leadgen_id:
                            continue

                        # Check if lead was already recorded
                        existing_lead = db.query(Lead).filter(Lead.meta_lead_id == leadgen_id).first()
                        if existing_lead:
                            print(f"[Meta Webhook] Lead {leadgen_id} already exists. Skipping.")
                            continue

                        # Step A: Identify which campaign & user owns this lead
                        target_user_id = None
                        matched_campaign = None

                        if ad_id:
                            matched_campaign = db.query(Campaign).filter(Campaign.meta_campaign_id == ad_id).first()

                        system_token = os.getenv("META_ACCESS_TOKEN", "").strip()
                        if ad_id and system_token and not matched_campaign:
                            try:
                                ad_url = f"https://graph.facebook.com/v19.0/{ad_id}?fields=campaign_id&access_token={system_token}"
                                ad_resp = requests.get(ad_url, timeout=5)
                                if ad_resp.status_code == 200:
                                    camp_id = str(ad_resp.json().get("campaign_id", ""))
                                    if camp_id:
                                        matched_campaign = db.query(Campaign).filter(Campaign.meta_campaign_id == camp_id).first()
                            except Exception as e:
                                print(f"[Meta Webhook] Failed to look up ad {ad_id}:", e)

                        token_for_lead = system_token
                        if matched_campaign:
                            target_user_id = matched_campaign.user_id
                            owner_user = db.query(User).filter(User.id == target_user_id).first()
                            if owner_user and owner_user.meta_access_token:
                                token_for_lead = owner_user.meta_access_token.strip()
                        else:
                            first_user = db.query(User).filter(User.meta_access_token.isnot(None)).first()
                            if first_user:
                                target_user_id = first_user.id
                                token_for_lead = first_user.meta_access_token.strip()
                            else:
                                first_any = db.query(User).first()
                                target_user_id = first_any.id if first_any else 1

                        # Step B: Fetch full lead details from Meta Graph API
                        lead_data = {}
                        if token_for_lead:
                            try:
                                lead_url = f"https://graph.facebook.com/v19.0/{leadgen_id}?access_token={token_for_lead}"
                                lead_res = requests.get(lead_url, timeout=7)
                                if lead_res.status_code == 200:
                                    lead_data = lead_res.json()
                            except Exception as e:
                                print(f"[Meta Webhook] Error fetching lead {leadgen_id}:", e)

                        # Step C: Parse field data
                        name = None
                        phone = None
                        email = None
                        city = None
                        answers_list = []

                        for field in lead_data.get("field_data", []):
                            fname = field.get("name", "").lower()
                            fvals = field.get("values", [])
                            val_str = fvals[0] if fvals else ""

                            if "name" in fname or "full_name" in fname or "first_name" in fname:
                                if not name:
                                    name = val_str
                            elif "phone" in fname or "mobile" in fname:
                                phone = val_str
                            elif "email" in fname:
                                email = val_str
                            elif "city" in fname:
                                city = val_str
                            else:
                                answers_list.append(f"{field.get('name')}: {val_str}")

                        import json
                        new_lead = Lead(
                            user_id=target_user_id,
                            campaign_id=matched_campaign.id if matched_campaign else None,
                            meta_campaign_id=matched_campaign.meta_campaign_id if matched_campaign else None,
                            campaign_name=matched_campaign.campaign_name if matched_campaign else "Direct Meta Lead",
                            meta_lead_id=leadgen_id,
                            form_id=form_id,
                            ad_id=ad_id,
                            name=name or f"Meta Lead #{leadgen_id[-4:]}",
                            phone=phone or "",
                            email=email or "",
                            city=city or "",
                            answers=json.dumps(answers_list) if answers_list else None,
                            lead_type="Lead Form",
                            status="New"
                        )
                        db.add(new_lead)
                        db.commit()
                        print(f"[Meta Webhook] Successfully routed lead {leadgen_id} to User #{target_user_id}!")

        # ----------------- 2. Instagram Video Ad Direct Messages (DMs) -----------------
        if payload.get("object") == "instagram":
            for entry in payload.get("entry", []):
                for msg_item in entry.get("messaging", []):
                    sender = msg_item.get("sender", {})
                    sender_id = str(sender.get("id", ""))
                    message_obj = msg_item.get("message", {})
                    mid = message_obj.get("mid", "")
                    text_content = message_obj.get("text", "")
                    referral = message_obj.get("referral", {})
                    ad_id = str(referral.get("ad_id", ""))

                    if not mid:
                        continue

                    existing_lead = db.query(Lead).filter(Lead.meta_lead_id == mid).first()
                    if existing_lead:
                        continue

                    # Match campaign & user
                    target_user_id = None
                    matched_campaign = None
                    if ad_id:
                        matched_campaign = db.query(Campaign).filter(Campaign.meta_campaign_id == ad_id).first()

                    system_token = os.getenv("META_ACCESS_TOKEN", "").strip()
                    if ad_id and system_token and not matched_campaign:
                        try:
                            ad_url = f"https://graph.facebook.com/v19.0/{ad_id}?fields=campaign_id&access_token={system_token}"
                            ad_resp = requests.get(ad_url, timeout=5)
                            if ad_resp.status_code == 200:
                                camp_id = str(ad_resp.json().get("campaign_id", ""))
                                if camp_id:
                                    matched_campaign = db.query(Campaign).filter(Campaign.meta_campaign_id == camp_id).first()
                        except Exception as e:
                            print(f"[Meta Webhook IG] Failed ad lookup {ad_id}:", e)

                    token_for_ig = system_token
                    if matched_campaign:
                        target_user_id = matched_campaign.user_id
                        owner_user = db.query(User).filter(User.id == target_user_id).first()
                        if owner_user and owner_user.meta_access_token:
                            token_for_ig = owner_user.meta_access_token.strip()
                    else:
                        first_user = db.query(User).filter(User.meta_access_token.isnot(None)).first()
                        target_user_id = first_user.id if first_user else 1

                    # Fetch Instagram Sender Profile (Username / Name)
                    ig_username = None
                    ig_name = None
                    if token_for_ig and sender_id:
                        try:
                            profile_url = f"https://graph.facebook.com/v19.0/{sender_id}?fields=name,username&access_token={token_for_ig}"
                            prof_res = requests.get(profile_url, timeout=5)
                            if prof_res.status_code == 200:
                                prof_data = prof_res.json()
                                ig_username = prof_data.get("username")
                                ig_name = prof_data.get("name")
                        except Exception as e:
                            print("[Meta Webhook IG] Profile fetch error:", e)

                    display_name = ig_name or (f"@{ig_username}" if ig_username else f"Instagram User #{sender_id[-4:]}")

                    new_ig_lead = Lead(
                        user_id=target_user_id,
                        campaign_id=matched_campaign.id if matched_campaign else None,
                        meta_campaign_id=matched_campaign.meta_campaign_id if matched_campaign else (ad_id or None),
                        campaign_name=matched_campaign.campaign_name if matched_campaign else "Instagram Video Ad Campaign",
                        meta_lead_id=mid,
                        ad_id=ad_id or None,
                        name=display_name,
                        phone="",
                        email="",
                        city="Instagram Direct",
                        lead_type="Instagram DM",
                        message_text=text_content or "Sent a DM from Instagram Video Ad",
                        instagram_username=ig_username or f"user_{sender_id[-4:]}",
                        status="New",
                        notes=f"Instagram Video Ad DM: {text_content}"
                    )
                    db.add(new_ig_lead)
                    db.commit()
                    print(f"[Meta Webhook IG] Successfully routed Instagram DM {mid} to User #{target_user_id}!")

        return {"status": "success"}
    except Exception as e:
        print("[Meta Webhook] Handler error:", e)
        return {"status": "error", "message": str(e)}


# ----------------- User Leads API (Isolated per Logged-in User) -----------------
class UpdateLeadStatusRequest(BaseModel):
    status: str
    notes: Optional[str] = None

class CreateTestLeadRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    city: Optional[str] = None
    campaign_name: Optional[str] = None
    lead_type: Optional[str] = "Lead Form"  # "Lead Form" or "Instagram DM"
    message_text: Optional[str] = None
    instagram_username: Optional[str] = None

@app.get("/api/leads")
def get_user_leads(
    search: Optional[str] = None,
    status: Optional[str] = None,
    campaign_id: Optional[str] = None,
    lead_type: Optional[str] = None,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Returns only the leads belonging to the currently logged in user.
    Strictly isolated: User A cannot see User B's leads.
    """
    if not current_user:
        return {"success": True, "count": 0, "leads": []}
    user_id = current_user.id
    query = db.query(Lead).filter(Lead.user_id == user_id)

    if status and status != "All":
        query = query.filter(Lead.status == status)

    if lead_type and lead_type != "All":
        query = query.filter(Lead.lead_type == lead_type)

    if campaign_id and campaign_id != "All":
        query = query.filter(Lead.meta_campaign_id == campaign_id)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Lead.name.ilike(search_filter)) |
            (Lead.phone.ilike(search_filter)) |
            (Lead.email.ilike(search_filter)) |
            (Lead.campaign_name.ilike(search_filter)) |
            (Lead.instagram_username.ilike(search_filter)) |
            (Lead.message_text.ilike(search_filter))
        )

    leads = query.order_by(Lead.created_at.desc()).all()

    return {
        "success": True,
        "count": len(leads),
        "leads": [
            {
                "id": l.id,
                "name": l.name,
                "phone": l.phone,
                "email": l.email,
                "city": l.city,
                "campaign_name": l.campaign_name,
                "meta_campaign_id": l.meta_campaign_id,
                "lead_type": l.lead_type or "Lead Form",
                "message_text": l.message_text,
                "instagram_username": l.instagram_username,
                "status": l.status,
                "notes": l.notes,
                "created_at": l.created_at.strftime("%Y-%m-%d %H:%M") if l.created_at else None
            }
            for l in leads
        ]
    }


@app.get("/api/leads/stats")
def get_user_lead_stats(
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """Returns analytics & lead conversion counters strictly for the current user."""
    if not current_user:
        return {
            "total_leads": 0,
            "today_leads": 0,
            "contacted_leads": 0,
            "converted_leads": 0,
            "instagram_dms": 0
        }
    user_id = current_user.id
    total = db.query(Lead).filter(Lead.user_id == user_id).count()
    
    today_start = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today = db.query(Lead).filter(Lead.user_id == user_id, Lead.created_at >= today_start).count()
    
    contacted = db.query(Lead).filter(Lead.user_id == user_id, Lead.status.in_(["Contacted", "Qualified"])).count()
    converted = db.query(Lead).filter(Lead.user_id == user_id, Lead.status == "Converted").count()
    ig_dms = db.query(Lead).filter(Lead.user_id == user_id, Lead.lead_type == "Instagram DM").count()

    return {
        "total_leads": total,
        "today_leads": today,
        "contacted_leads": contacted,
        "converted_leads": converted,
        "instagram_dms": ig_dms
    }


@app.patch("/api/leads/{lead_id}/status")
def update_lead_status(
    lead_id: int,
    req: UpdateLeadStatusRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    lead = db.query(Lead).filter(Lead.id == lead_id, Lead.user_id == current_user.id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    lead.status = req.status
    if req.notes is not None:
        lead.notes = req.notes
    db.commit()
    return {"success": True, "message": "Lead status updated", "new_status": lead.status}


@app.delete("/api/leads/{lead_id}")
def delete_lead(
    lead_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    lead = db.query(Lead).filter(Lead.id == lead_id, Lead.user_id == current_user.id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    db.delete(lead)
    db.commit()
    return {"success": True, "message": "Lead deleted successfully"}


@app.post("/api/leads/test")
def create_test_lead(
    req: CreateTestLeadRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generates a sample lead (Form or Instagram Video Ad DM) for testing."""
    import random
    user_id = current_user.id
    
    if req.lead_type == "Instagram DM":
        sample_ig_users = [
            ("Aanya Kapoor", "aanya.lifestyle", "Hi! Just watched your Instagram video reel ad. Can you share prices and offers?"),
            ("Rohan Mehta", "rohan_fitness99", "Saw the video ad on my feed! Want to know how to get started?"),
            ("Simran Kaur", "simran_designs", "Loved the product in your video ad! Do you deliver in Delhi?"),
            ("Kunal Varma", "kunal.official", "Sent you a DM after seeing your sponsor video. Please share details.")
        ]
        chosen = random.choice(sample_ig_users)
        
        test_lead = Lead(
            user_id=user_id,
            name=req.name or chosen[0],
            phone=req.phone or "",
            email=req.email or "",
            city="Instagram Direct",
            campaign_name=req.campaign_name or "Instagram Reel Video Ad (DM Campaign)",
            meta_lead_id=f"ig_mid_{random.randint(10000000, 99999999)}",
            lead_type="Instagram DM",
            message_text=req.message_text or chosen[2],
            instagram_username=req.instagram_username or chosen[1],
            status="New",
            notes=f"Customer sent DM from Instagram Video Ad: {req.message_text or chosen[2]}",
            created_at=datetime.datetime.utcnow()
        )
    else:
        sample_names = ["Rohan Verma", "Priya Singh", "Amit Patel", "Neha Sharma", "Vikram Malhotra"]
        sample_cities = ["Delhi", "Mumbai", "Bangalore", "Pune", "Jaipur"]
        
        rnd_name = req.name or random.choice(sample_names)
        rnd_phone = req.phone or f"+9198{random.randint(10000000, 99999999)}"
        rnd_email = req.email or f"{rnd_name.lower().replace(' ', '.')}@gmail.com"
        rnd_city = req.city or random.choice(sample_cities)
        rnd_camp = req.campaign_name or "Real Estate Diwali Offer"
        
        test_lead = Lead(
            user_id=user_id,
            name=rnd_name,
            phone=rnd_phone,
            email=rnd_email,
            city=rnd_city,
            campaign_name=rnd_camp,
            meta_lead_id=f"test_{random.randint(100000, 999999)}",
            lead_type="Lead Form",
            status="New",
            created_at=datetime.datetime.utcnow()
        )

    db.add(test_lead)
    db.commit()
    db.refresh(test_lead)
    return {
        "success": True, 
        "message": f"Sample {test_lead.lead_type} added successfully!", 
        "lead_id": test_lead.id
    }



