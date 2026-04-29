import os
import mlflow

# 🔥 AZURE SQL = tracking store (NAJWAŻNIEJSZE)
DATABASE_URL = os.getenv("DATABASE_URL")

# 🔥 Azure Blob (artifact storage)
AZURE_STORAGE_ACCOUNT = os.getenv("AZURE_STORAGE_ACCOUNT")
CONTAINER = os.getenv("AZURE_CONTAINER_NAME", "mlops-files")

MLFLOW_ARTIFACT_URI = (
    f"wasbs://{CONTAINER}@{AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/mlflow"
)


def setup_mlflow():
    if not DATABASE_URL:
        raise Exception("DATABASE_URL not set")

    # 🔥 KLUCZ: zapis do Azure SQL
    mlflow.set_tracking_uri(DATABASE_URL)

    # registry = tracking (OK)
    mlflow.set_registry_uri(DATABASE_URL)

    print("\n🔥 MLflow CONFIG")
    print("Tracking (Azure SQL):", DATABASE_URL)
    print("Artifacts (Azure Blob):", MLFLOW_ARTIFACT_URI)