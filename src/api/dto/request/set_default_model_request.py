# src/api/dto/request/set_default_model_request.py
from pydantic import BaseModel


class SetDefaultModelRequest(BaseModel):
    model_name: str