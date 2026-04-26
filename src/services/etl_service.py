import os
from src.pipelines.etl.process import ETLPipeline
from src.utils.blob_helper import download_bytes
import pandas as pd
import io


class ETLService:

    @staticmethod
    def process(filename: str, steps: dict):
        print("\n🔥 ETLService START")
        print("filename:", filename)

        print("⬇️ downloading RAW file from Azure...")

        try:
            file_bytes = download_bytes(f"raw/{filename}")
        except Exception as e:
            print("❌ download failed:", str(e))
            raise Exception("File not found in Azure")

        print("✅ file downloaded")

        df = pd.read_csv(io.BytesIO(file_bytes), sep=";")

        print("📊 dataframe shape:", df.shape)

        result = ETLPipeline.run(
            filename=filename,
            steps=steps,
            df=df  # 🔥 przekazujemy dataframe zamiast pliku
        )

        return result