from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes.file_route import router as file_router
from src.api.routes.etl_route import router as etl_router
from src.api.routes.ml_route import router as ml_router
from src.api.routes.pipeline_route import router as pipeline_router
from src.api.routes.predict_route import router as predict_router
from src.api.routes.auth_route import router as auth_router
from src.api.routes.models_route import router as models_router

app = FastAPI(title="MLOps Project API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,  
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(predict_router)
app.include_router(pipeline_router)
app.include_router(ml_router)
app.include_router(file_router)
app.include_router(etl_router)
app.include_router(models_router)

@app.get("/")
def root():
    return {"message": "API działa 🚀"}