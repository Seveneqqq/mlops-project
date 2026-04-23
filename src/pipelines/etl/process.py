import os
import pandas as pd
from datetime import datetime
import json

import mlflow

from src.pipelines.etl.steps.cleaning import apply_cleaning
from src.pipelines.etl.steps.encoding import apply_encoding
from src.pipelines.etl.steps.scaling import apply_scaling

RAW_PATH = "src/data/raw"
PROCESSED_PATH = "src/data/processed"


class ETLPipeline:

    @staticmethod
    def run(filename: str, steps: dict):

        file_path = os.path.join(RAW_PATH, filename)

        if not os.path.exists(file_path):
            raise Exception("Raw file not found")

        df = pd.read_csv(file_path, sep=";")

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
            # SAVE
            # =====================
            timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            processed_filename = f"{filename.split('.')[0]}_processed_{timestamp}.csv"

            save_path = os.path.join(PROCESSED_PATH, processed_filename)
            df.to_csv(save_path, index=False)

            # 🔥 AFTER
            mlflow.log_param("processed_file", processed_filename)
            mlflow.log_metric("output_rows", len(df))
            mlflow.log_metric("output_columns", len(df.columns))

            # 🔥 opcjonalnie: sample dataset
            sample_path = os.path.join(PROCESSED_PATH, "sample.csv")
            df.head(50).to_csv(sample_path, index=False)
            mlflow.log_artifact(sample_path)

        return {
            "processed_filename": processed_filename,
            "records_count": len(df),
            "columns": df.columns.tolist()
        }