# src/api/dto/response/default_model_response.py
from pydantic import BaseModel


class DefaultModelResponse(BaseModel):
    model_name: str