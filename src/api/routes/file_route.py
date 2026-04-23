from fastapi import APIRouter, UploadFile, File, HTTPException
import os
from src.services.file_service import FileService
from src.api.dto.response.file_response import (
    FileUploadResponse,
    FileInfoResponse,
    FileListResponse,
    MessageResponse
)

router = APIRouter(prefix="/files", tags=["Files"])


@router.post("/upload", response_model=FileUploadResponse)
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")

    file_path = FileService.save_file(file)
    info = FileService.get_file_info(file_path)

    saved_filename = os.path.basename(file_path)

    return FileUploadResponse(
        filename=saved_filename,
        size_kb=info["size_kb"],
        records_count=info["records_count"],
        columns=info["columns"]
    )


@router.get("/", response_model=FileListResponse)
def list_files():
    files = FileService.list_files()
    return FileListResponse(files=files)


@router.get("/{filename}", response_model=FileInfoResponse)
def get_file_info(filename: str):
    file_path = f"src/data/raw/{filename}"

    try:
        info = FileService.get_file_info(file_path)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found or invalid")

    return FileInfoResponse(
        filename=filename,
        size_kb=info["size_kb"],
        records_count=info["records_count"],
        columns=info["columns"]
    )


@router.delete("/{filename}", response_model=MessageResponse)
def delete_file(filename: str):
    success = FileService.delete_file(filename)

    if not success:
        raise HTTPException(status_code=404, detail="File not found")

    return MessageResponse(message=f"{filename} deleted")