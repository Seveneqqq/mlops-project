import os
import joblib
import pandas as pd
import json
from datetime import datetime

import mlflow

from sqlalchemy.orm import Session
from src.db.models import Prediction

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "src/ml_models")


class PredictService:

    @staticmethod
    def predict(db: Session, model_name: str, data: dict):

        model_path = os.path.join(MODEL_PATH, model_name)

        if not os.path.exists(model_path):
            raise Exception("Model not found")

        model = joblib.load(model_path)

        df = pd.DataFrame([data])

        prediction = model.predict(df)[0]

        # 🔥 probability
        if hasattr(model, "predict_proba"):
            proba = float(max(model.predict_proba(df)[0]))
        else:
            proba = None

        prediction_map = {
            0: "Dropout",
            1: "Enrolled",
            2: "Graduate"
        }

        prediction_label = prediction_map.get(int(prediction), str(prediction))

        # =========================
        # 🔥 MLflow LOGGING
        # =========================
        mlflow.set_experiment("student-dropout-inference")

        with mlflow.start_run():

            mlflow.log_param("model_name", model_name)

            # zapis input jako JSON (czytelniej niż str)
            mlflow.log_param("input_data", json.dumps(data))

            mlflow.log_param("prediction", prediction_label)

            if proba is not None:
                mlflow.log_metric("probability", proba)

            mlflow.log_param("timestamp", datetime.now().isoformat())

        # =========================
        # 🔥 DB LOGGING (monitoring)
        # =========================
        record = Prediction(
            model_name=model_name,
            input_data=json.dumps(data),
            prediction=prediction_label,
            probability=proba
        )

        db.add(record)
        db.commit()

        return {
            "prediction": prediction_label,
            "probability": proba
        }