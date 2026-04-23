from pydantic import BaseModel
from typing import Optional


class ETLSteps(BaseModel):
    drop_na: Optional[bool] = False
    fill_na: Optional[str] = None  # mean, median, mode
    encode_categorical: Optional[bool] = False
    scale_numeric: Optional[str] = None  # standard, minmax


class ETLRequest(BaseModel):
    filename: str
    steps: ETLSteps