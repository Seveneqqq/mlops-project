from src.pipelines.etl.process import ETLPipeline
from src.pipelines.ml.train import MLPipeline


class FullPipeline:

    @staticmethod
    def run(etl_request, ml_request):
        etl_result = ETLPipeline.run(
            filename=etl_request["filename"],
            steps=etl_request["steps"]
        )

        ml_result = MLPipeline.train(
            filename=etl_result["processed_filename"],
            target=ml_request["target"],
            model_type=ml_request["model_type"],
            params=ml_request.get("params", {})
        )

        return {
            "etl": etl_result,
            "ml": ml_result
        }