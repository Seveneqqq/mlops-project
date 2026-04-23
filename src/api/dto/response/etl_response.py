from pydantic import BaseModel
from typing import List


class ETLResponse(BaseModel):
    filename: str
    processed_filename: str
    records_count: int