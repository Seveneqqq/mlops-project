from pydantic import BaseModel


class MLResponse(BaseModel):
    model_name: str
    accuracy: float