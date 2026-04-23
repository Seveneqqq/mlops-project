from pydantic import BaseModel
from typing import List

class FileUploadResponse(BaseModel):
    filename: str
    size_kb: float
    records_count: int
    columns: List[str]


class FileInfoResponse(BaseModel):
    filename: str
    size_kb: float
    records_count: int
    columns: List[str]


class FileListResponse(BaseModel):
    files: List[str]


class MessageResponse(BaseModel):
    message: str