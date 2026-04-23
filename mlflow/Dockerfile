FROM python:3.12-slim

WORKDIR /app

RUN pip install mlflow

CMD ["mlflow", "server", "--host", "0.0.0.0", "--port", "5000"]