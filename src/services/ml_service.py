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

        return MLPipeline.train(
            filename=filename,
            target=target,
            model_type=model_type,
            params=params,
        )