from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Meta Connection Details
    meta_access_token = Column(String, nullable=True)
    meta_account_id = Column(String, nullable=True)
    meta_account_name = Column(String, nullable=True)
    selected_ad_account_id = Column(String, nullable=True)
    selected_ad_account_name = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    meta_campaign_id = Column(String, unique=True, index=True, nullable=False)
    campaign_name = Column(String, index=True, nullable=False)
    objective = Column(String, nullable=True)  # OUTCOME_LEADS, OUTCOME_TRAFFIC, OUTCOME_SALES
    status = Column(String, default="ACTIVE")
    ad_account_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    campaign_id = Column(Integer, nullable=True, index=True)
    meta_campaign_id = Column(String, nullable=True, index=True)
    campaign_name = Column(String, nullable=True)
    meta_lead_id = Column(String, unique=True, index=True, nullable=True)
    form_id = Column(String, nullable=True)
    ad_id = Column(String, nullable=True)
    
    # Lead Personal Details
    name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    city = Column(String, nullable=True)
    answers = Column(Text, nullable=True)  # JSON or text of custom question answers
    
    # Lead Source & Messaging Details (Lead Form vs Instagram DM vs WhatsApp)
    lead_type = Column(String, default="Lead Form")  # "Lead Form", "Instagram DM", "WhatsApp"
    message_text = Column(Text, nullable=True)  # DM content if user messaged from an ad
    instagram_username = Column(String, nullable=True)  # @handle of the Instagram user
    
    # Lead Lifecycle Status
    status = Column(String, default="New")  # New, Contacted, Qualified, Converted, Lost
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


