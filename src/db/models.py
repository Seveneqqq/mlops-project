from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Boolean
from datetime import datetime
from src.db.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String)
    input_data = Column(Text)
    prediction = Column(String)
    probability = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)


class DefaultModel(Base):
    __tablename__ = "default_model"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)