from azure.storage.blob import BlobServiceClient
import os
import pandas as pd
from fastapi import UploadFile
from typing import List, Dict
from io import BytesIO

AZURE_CONN = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
CONTAINER = os.getenv("AZURE_CONTAINER_NAME", "mlops-files")

blob_service = BlobServiceClient.from_connection_string(AZURE_CONN)
container_client = blob_service.get_container_client(CONTAINER)


class FileService:

    @staticmethod
    def save_file(file: UploadFile) -> str:
        filename = file.filename

        blob_name = f"raw/{filename}"
        blob_client = container_client.get_blob_client(blob_name)

        content = file.file.read()

        blob_client.upload_blob(content, overwrite=True)

        return filename

    @staticmethod
    def get_file_info(filename: str):
        blob_name = f"raw/{filename}"
        blob_client = container_client.get_blob_client(blob_name)

        data = blob_client.download_blob().readall()

        df = pd.read_csv(BytesIO(data))

        return {
            "records_count": len(df),
            "columns": df.columns.tolist(),
            "size_kb": round(len(data) / 1024, 2)
        }

    @staticmethod
    def list_files() -> List[str]:
        blobs = container_client.list_blobs(name_starts_with="raw/")
        return [b.name.replace("raw/", "") for b in blobs]

    @staticmethod
    def list_files_with_info() -> List[Dict]:
        files = FileService.list_files()
        result = []

        for f in files:
            try:
                info = FileService.get_file_info(f)
                result.append({
                    "filename": f,
                    "size_kb": info["size_kb"],
                    "records_count": info["records_count"],
                    "columns": info["columns"]
                })
            except Exception:
                continue

        return result

    @staticmethod
    def delete_file(filename: str) -> bool:
        blob_name = f"raw/{filename}"
        blob_client = container_client.get_blob_client(blob_name)

        try:
            blob_client.delete_blob()
            return True
        except Exception:
            return False