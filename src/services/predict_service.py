import os
import joblib
import pandas as pd
import json
from datetime import datetime
import io

import mlflow

from sqlalchemy.orm import Session
from src.db.models import Prediction
from src.db.models import DefaultModel, Prediction

# 🔥 AZURE
from src.utils.blob_helper import download_bytes

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "src/ml_models")

os.makedirs(MODEL_PATH, exist_ok=True)


class PredictService:

    @staticmethod
    def predict(db: Session, model_name: str, data: dict):
        print("\n🔥 PredictService START")
        print("incoming model_name:", model_name)

        # 🔥 ALWAYS GET DEFAULT MODEL FROM DB
        default_model = db.query(DefaultModel).filter_by(is_active=True).first()

        if not default_model:
            raise Exception("No default model set")

        model_name = default_model.model_name

        print("🎯 using default model from DB:", model_name)

        print("⬇️ downloading model from Azure (bytes)...")

        try:
            model_bytes = download_bytes(f"models/{model_name}")
        except Exception as e:
            print("❌ download failed:", str(e))
            raise Exception("Model not found in Azure")

        print("✅ model downloaded from Azure")

        print("📦 loading model from memory...")
        model = joblib.load(io.BytesIO(model_bytes))

        df = pd.DataFrame([data])

        print("📊 input data:", df)

        prediction = model.predict(df)[0]

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

        print("🎯 prediction:", prediction_label)
        print("📈 probability:", proba)

        record = Prediction(
            model_name=model_name,
            input_data=json.dumps(data),
            prediction=prediction_label,
            probability=proba
        )

        db.add(record)
        db.commit()

        print("✅ saved to DB")

        return {
            "prediction": prediction_label,
            "probability": proba
        }