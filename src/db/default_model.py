# src/db/models/default_model.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from src.db.database import Base


class DefaultModel(Base):
    __tablename__ = "default_model"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)