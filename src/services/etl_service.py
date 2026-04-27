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

        result = ETLPipeline.run(
            filename=filename,
            steps=steps,
        )

        return result