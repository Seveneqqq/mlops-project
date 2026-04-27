from fastapi import APIRouter, UploadFile, File, HTTPException
from src.services.file_service import FileService
from src.api.dto.response.file_response import (
    FileUploadResponse,
    FileInfoResponse,
    FileListResponse,
    MessageResponse
)

router = APIRouter(prefix="/files", tags=["Files"])


# 🔹 UPLOAD
@router.post("/upload", response_model=FileUploadResponse)
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")

    filename = FileService.save_file(file)
    info = FileService.get_file_info(filename)

    return FileUploadResponse(
        filename=filename,
        size_kb=info["size_kb"],
        records_count=info["records_count"],
        columns=info["columns"]
    )


# 🔹 LIST RAW FILES
@router.get("/", response_model=FileListResponse)
def list_files():
    files = FileService.list_files()
    return FileListResponse(files=files)


# 🔹 LIST PROCESSED FILES
@router.get("/processed", response_model=FileListResponse)
def list_files_processed():
    files = FileService.list_files_processed()
    return FileListResponse(files=files)


# 🔥 🔥 🔥 NAJWAŻNIEJSZE — MUSI BYĆ PRZED /{filename}
# 🔹 LIST MODELS (Azure)
@router.get("/models", response_model=FileListResponse)
def list_files_models():
    try:
        files = FileService.list_files_models()
        return FileListResponse(files=files)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 🔹 FILE INFO (MUSI BYĆ NA KOŃCU)
@router.get("/{filename}", response_model=FileInfoResponse)
def get_file_info(filename: str):
    try:
        info = FileService.get_file_info(filename)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found or invalid")

    return FileInfoResponse(
        filename=filename,
        size_kb=info["size_kb"],
        records_count=info["records_count"],
        columns=info["columns"]
    )


# 🔹 DELETE
@router.delete("/{filename}", response_model=MessageResponse)
def delete_file(filename: str):
    success = FileService.delete_file(filename)

    if not success:
        raise HTTPException(status_code=404, detail="File not found")

    return MessageResponse(message=f"{filename} deleted")