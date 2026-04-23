from pydantic import BaseModel


class MLRequest(BaseModel):
    filename: str
    target: str
    model_type: str  # logistic_regression, random_forest