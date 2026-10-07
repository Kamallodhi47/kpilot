from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from models import User
from auth import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM
from jose import JWTError, jwt

load_dotenv()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nyx Meta API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

class UserCreate(BaseModel):
    email: str
    password: str

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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

@app.get("/")
def read_root():
    return {"message": "Welcome to Nyx Backend - Multi-Tenant Mode"}

@app.post("/api/auth/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    # Automatically seed the current Meta token from .env for demo if it exists, otherwise empty
    env_meta_token = os.getenv("META_ACCESS_TOKEN", "")
    
    new_user = User(email=user.email, password_hash=hashed_password, meta_access_token=env_meta_token)
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

@app.get("/api/meta/status")
def get_meta_status(current_user: User = Depends(get_current_user)):
    return {
        "connected": bool(current_user.meta_access_token and current_user.meta_account_id),
        "account_name": current_user.meta_account_name,
        "account_id": current_user.meta_account_id
    }

@app.post("/api/meta/connect")
def connect_meta(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Use the user's specific token. For now, it might be pre-seeded from signup.
    access_token = current_user.meta_access_token
    if not access_token:
        raise HTTPException(status_code=400, detail="No Meta access token configured for this user.")
        
    url = f"https://graph.facebook.com/me?access_token={access_token}"
    response = requests.get(url)
    
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to connect to Meta: " + response.text)
        
    data = response.json()
    
    current_user.meta_account_id = data.get("id")
    current_user.meta_account_name = data.get("name")
    db.commit()
    
    return {
        "success": True, 
        "message": f"Successfully connected to Meta as {current_user.meta_account_name}!",
        "account_name": current_user.meta_account_name,
        "account_id": current_user.meta_account_id
    }

@app.post("/api/meta/disconnect")
def disconnect_meta(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.meta_access_token = None
    current_user.meta_account_id = None
    current_user.meta_account_name = None
    db.commit()
    return {"success": True, "message": "Disconnected"}

@app.get("/api/meta/oauth/url")
def get_meta_oauth_url():
    app_id = os.getenv("FB_APP_ID")
    redirect_uri = "http://localhost:5173/meta/callback"
    scope = "ads_management,pages_show_list,pages_read_engagement"
    url = f"https://www.facebook.com/v18.0/dialog/oauth?client_id={app_id}&redirect_uri={redirect_uri}&scope={scope}&config_id=941255918608952"
    return {"url": url}

class OAuthCallback(BaseModel):
    code: str

@app.post("/api/meta/oauth/callback")
def meta_oauth_callback(payload: OAuthCallback, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = os.getenv("FB_APP_ID")
    app_secret = os.getenv("FB_APP_SECRET")
    redirect_uri = "http://localhost:5173/meta/callback"
    
    # 1. Exchange code for access token
    token_url = f"https://graph.facebook.com/v18.0/oauth/access_token?client_id={app_id}&redirect_uri={redirect_uri}&client_secret={app_secret}&code={payload.code}"
    token_res = requests.get(token_url)
    if token_res.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get access token from Meta")
    
    token_data = token_res.json()
    access_token = token_data.get("access_token")
    
    # 2. Get user info
    me_url = f"https://graph.facebook.com/me?access_token={access_token}"
    me_res = requests.get(me_url)
    if me_res.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch user info from Meta")
        
    me_data = me_res.json()
    
    # 3. Save to database
    current_user.meta_access_token = access_token
    current_user.meta_account_id = me_data.get("id")
    current_user.meta_account_name = me_data.get("name")
    db.commit()
    
    return {"success": True, "account_name": current_user.meta_account_name}
