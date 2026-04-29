import os
import mlflow

AZURE_CONN = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
CONTAINER = os.getenv("AZURE_CONTAINER_NAME", "mlops-files")

# 🔥 MLflow config
MLFLOW_TRACKING_URI = "sqlite:///mlflow.db"

# 🔥 Azure Blob jako artifact storage
MLFLOW_ARTIFACT_URI = f"wasbs://{CONTAINER}@{os.getenv('AZURE_STORAGE_ACCOUNT')}.blob.core.windows.net/mlflow"


def setup_mlflow():
    mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
    mlflow.set_registry_uri(MLFLOW_TRACKING_URI)