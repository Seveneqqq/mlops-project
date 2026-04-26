from azure.storage.blob import BlobServiceClient
import os

conn_str = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
container_name = os.getenv("AZURE_CONTAINER_NAME")

blob_service_client = BlobServiceClient.from_connection_string(conn_str)
container_client = blob_service_client.get_container_client(container_name)


def upload_bytes(data: bytes, blob_name: str):
    blob_client = container_client.get_blob_client(blob_name)
    blob_client.upload_blob(data, overwrite=True)


def download_bytes(blob_name: str) -> bytes:
    blob_client = container_client.get_blob_client(blob_name)
    return blob_client.download_blob().readall()