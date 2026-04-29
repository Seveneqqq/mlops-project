import os
import pandas as pd
from datetime import datetime
import io

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

import joblib

import mlflow
import mlflow.sklearn
from src.config.mlflow_config import setup_mlflow

# 🔥 AZURE
from src.utils.blob_helper import download_bytes, upload_bytes


PROCESSED_PATH = "src/data/processed"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "ml_models")


# 🔥 FIX: normalize params (bool, int, float, None)
def normalize_params(params: dict):
    normalized = {}

    for k, v in params.items():

        if v is None or v == "":
            continue

        if isinstance(v, str):

            if v.lower() == "true":
                normalized[k] = True
            elif v.lower() == "false":
                normalized[k] = False
            elif v.lower() == "none":
                normalized[k] = None
            else:
                try:
                    if "." in v:
                        normalized[k] = float(v)
                    else:
                        normalized[k] = int(v)
                except:
                    normalized[k] = v
        else:
            normalized[k] = v

    return normalized


class MLPipeline:

    @staticmethod
    def train(filename: str, target: str, model_type: str, params: dict):

        setup_mlflow()
        mlflow.set_experiment("student-dropout")

        print("\n🔥 MLPipeline START")
        print("filename:", filename)

        # 🔥 POBIERZ Z AZURE
        print("⬇️ downloading processed file from Azure...")
        try:
            file_bytes = download_bytes(f"processed/{filename}")
        except Exception as e:
            print("❌ download failed:", str(e))
            raise Exception("Processed file not found in Azure")

        print("✅ file downloaded")

        df = pd.read_csv(io.BytesIO(file_bytes))

        if df.empty:
            raise Exception("Dataset is empty")

        if target not in df.columns:
            raise Exception("Target column not found")

        target_cols = [col for col in df.columns if col.startswith("Target_")]

        X = df.drop(columns=target_cols)
        y = df[target]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # 🔥 FIX: normalize params
        params = normalize_params(params)

        if model_type == "logistic_regression":
            model = LogisticRegression(**params)

        elif model_type == "random_forest":
            model = RandomForestClassifier(**params)

        else:
            raise Exception("Invalid model type")

        mlflow.set_experiment("student-dropout")

        with mlflow.start_run():

            model.fit(X_train, y_train)

            y_pred = model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)

            mlflow.log_param("model_type", model_type)
            mlflow.log_params(params)
            mlflow.log_metric("accuracy", accuracy)

            mlflow.sklearn.log_model(model, "model")
            with open("temp_model.pkl", "wb") as f:
                joblib.dump(model, f)

            mlflow.log_artifact("temp_model.pkl")

        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        model_name = f"{model_type}_{timestamp}.pkl"

        print("⬆️ uploading model to Azure...")

        # 🔥 ZAPIS DO AZURE (bez lokalnego pliku)
        model_buffer = io.BytesIO()
        joblib.dump(model, model_buffer)
        model_buffer.seek(0)

        upload_bytes(model_buffer.read(), f"models/{model_name}")

        print("✅ model uploaded")

        return {
            "model_name": model_name,
            "accuracy": float(accuracy)
        }