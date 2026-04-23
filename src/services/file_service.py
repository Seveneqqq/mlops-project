import os
from datetime import datetime
import pandas as pd
from fastapi import UploadFile
from typing import List, Dict

RAW_DATA_PATH = "src/data/raw"


class FileService:

    @staticmethod
    def save_file(file: UploadFile) -> str:
        filename = file.filename
        file_path = os.path.join(RAW_DATA_PATH, filename)

        if os.path.exists(file_path):
            name, ext = os.path.splitext(filename)
            timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            filename = f"{name}_{timestamp}{ext}"
            file_path = os.path.join(RAW_DATA_PATH, filename)

        with open(file_path, "wb") as f:
            f.write(file.file.read())

        return file_path

    @staticmethod
    def get_file_info(file_path: str):
        df = pd.read_csv(file_path)
        size_kb = os.path.getsize(file_path) / 1024

        return {
            "records_count": len(df),
            "columns": df.columns.tolist(),
            "size_kb": round(size_kb, 2)
        }

    @staticmethod
    def list_files() -> List[str]:
        files = os.listdir(RAW_DATA_PATH)
        files = sorted(
            files,
            key=lambda f: os.path.getmtime(os.path.join(RAW_DATA_PATH, f)),
            reverse=True
        )
        return files

    @staticmethod
    def list_files_with_info() -> List[Dict]:
        files = FileService.list_files()
        result = []

        for f in files:
            path = os.path.join(RAW_DATA_PATH, f)
            info = FileService.get_file_info(path)
            result.append({
                "filename": f,
                "size_kb": info["size_kb"],
                "records_count": info["records_count"],
                "columns": info["columns"]
            })

        return result

    @staticmethod
    def delete_file(filename: str) -> bool:
        file_path = os.path.join(RAW_DATA_PATH, filename)

        if os.path.exists(file_path):
            os.remove(file_path)
            return True

        return False