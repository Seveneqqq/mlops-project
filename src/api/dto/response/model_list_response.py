# src/api/dto/response/model_list_response.py
from pydantic import BaseModel
from typing import List


class ModelItem(BaseModel):
    model_name: str
    is_active: bool


class ModelListResponse(BaseModel):
    models: List[ModelItem]