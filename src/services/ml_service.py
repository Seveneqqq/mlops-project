import os
from src.pipelines.ml.train import MLPipeline
from src.utils.blob_helper import download_bytes
import pandas as pd
import io


class MLService:

    @staticmethod
    def train_model(filename: str, target: str, model_type: str, params: dict):
        print("\n🔥 MLService START")
        print("filename:", filename)

        print("⬇️ downloading processed file from Azure...")

        try:
            file_bytes = download_bytes(f"processed/{filename}")
        except Exception as e:
            print("❌ download failed:", str(e))
            raise Exception("Processed file not found in Azure")

        print("✅ file downloaded")

        df = pd.read_csv(io.BytesIO(file_bytes))

        print("📊 dataframe shape:", df.shape)

        return MLPipeline.train(
            filename=filename,
            target=target,
            model_type=model_type,
            params=params,
            df=df  # 🔥 przekazujemy dataframe zamiast pliku
        )