import os
from src.pipelines.etl.process import ETLPipeline

RAW_PATH = "src/data/raw"


class ETLService:

    @staticmethod
    def process(filename: str, steps: dict):
        file_path = os.path.join(RAW_PATH, filename)

        if not os.path.exists(file_path):
            raise Exception("File not found")

        result = ETLPipeline.run(
            filename=filename,
            steps=steps
        )

        return result