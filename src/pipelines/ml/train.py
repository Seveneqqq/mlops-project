import os
import pandas as pd
from datetime import datetime

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

import joblib

import mlflow
import mlflow.sklearn


PROCESSED_PATH = "src/data/processed"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "ml_models")


class MLPipeline:

    @staticmethod
    def train(filename: str, target: str, model_type: str, params: dict):

        file_path = os.path.join(PROCESSED_PATH, filename)

        if not os.path.exists(file_path):
            raise Exception("Processed file not found")

        df = pd.read_csv(file_path)

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

        if model_type == "logistic_regression":
            model = LogisticRegression(max_iter=1000, **params)

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

        os.makedirs(MODEL_PATH, exist_ok=True)

        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        model_name = f"{model_type}_{timestamp}.pkl"

        model_path = os.path.join(MODEL_PATH, model_name)

        joblib.dump(model, model_path)

        return {
            "model_name": model_name,
            "accuracy": float(accuracy)
        }