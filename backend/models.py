from sqlalchemy import Column, Integer, String, Boolean, DateTime
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    
    # Meta Connection Details
    meta_access_token = Column(String, nullable=True)
    meta_account_id = Column(String, nullable=True)
    meta_account_name = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
