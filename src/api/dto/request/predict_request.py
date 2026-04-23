from pydantic import BaseModel
from typing import Dict


class PredictRequest(BaseModel):
    model_name: str
    data: Dict