from pydantic import BaseModel
from typing import Optional


class PredictResponse(BaseModel):
    prediction: str
    probability: Optional[float]