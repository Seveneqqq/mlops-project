import os
from src.pipelines.ml.train import MLPipeline

PROCESSED_PATH = "src/data/processed"


class MLService:

    @staticmethod
    def train_model(filename: str, target: str, model_type: str, params: dict):
        file_path = os.path.join(PROCESSED_PATH, filename)

        if not os.path.exists(file_path):
            raise Exception("Processed file not found")

        return MLPipeline.train(
            filename=filename,
            target=target,
            model_type=model_type,
            params=params
        )