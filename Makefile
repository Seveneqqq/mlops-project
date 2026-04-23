run:
	uvicorn src.api.main:app --reload

mlflow:
	mlflow ui --port 5000

dev:
	make -j2 run mlflow