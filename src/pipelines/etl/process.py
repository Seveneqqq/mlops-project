import os
import pandas as pd
from datetime import datetime
import json
import io

import mlflow

from src.pipelines.etl.steps.cleaning import apply_cleaning
from src.pipelines.etl.steps.encoding import apply_encoding
from src.pipelines.etl.steps.scaling import apply_scaling

# 🔥 AZURE
from src.utils.blob_helper import download_bytes, upload_bytes


RAW_PATH = "src/data/raw"
PROCESSED_PATH = "src/data/processed"


class ETLPipeline:

    @staticmethod
    def run(filename: str, steps: dict):

        print("\n🔥 ETLPipeline START")
        print("filename:", filename)

        # 🔥 POBIERZ RAW Z AZURE
        print("⬇️ downloading RAW file from Azure...")
        try:
            file_bytes = download_bytes(f"raw/{filename}")
        except Exception as e:
            print("❌ download failed:", str(e))
            raise Exception("Raw file not found in Azure")

        print("✅ RAW file downloaded")

        df = pd.read_csv(io.BytesIO(file_bytes), sep=";")

        mlflow.set_experiment("etl-pipeline")

        with mlflow.start_run():

            # 🔥 BEFORE
            mlflow.log_param("raw_file", filename)
            mlflow.log_param("steps", json.dumps(steps))
            mlflow.log_metric("input_rows", len(df))
            mlflow.log_metric("input_columns", len(df.columns))

            # =====================
            # ETL STEPS
            # =====================
            df = apply_cleaning(df, steps)
            df = apply_encoding(df, steps)
            df = apply_scaling(df, steps)

            # =====================
            # SAVE TO AZURE
            # =====================
            timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            processed_filename = f"{filename.split('.')[0]}_processed_{timestamp}.csv"

            print("⬆️ uploading processed file to Azure...")

            csv_buffer = io.StringIO()
            df.to_csv(csv_buffer, index=False)

            upload_bytes(
                csv_buffer.getvalue().encode(),
                f"processed/{processed_filename}"
            )

            print("✅ processed file uploaded")

            # 🔥 AFTER
            mlflow.log_param("processed_file", processed_filename)
            mlflow.log_metric("output_rows", len(df))
            mlflow.log_metric("output_columns", len(df.columns))

            # 🔥 SAMPLE → Azure
            sample_buffer = io.StringIO()
            df.head(50).to_csv(sample_buffer, index=False)

            upload_bytes(
                sample_buffer.getvalue().encode(),
                "processed/sample.csv"
            )

        return {
            "processed_filename": processed_filename,
            "records_count": len(df),
            "columns": df.columns.tolist()
        }