from sqlalchemy import Column, Integer, String, Float, Text, DateTime
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