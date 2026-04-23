from fastapi import APIRouter, HTTPException
from src.api.dto.request.ml_request import MLRequest
from src.api.dto.response.ml_response import MLResponse
from src.services.ml_service import MLService

router = APIRouter(prefix="/ml", tags=["ML"])


@router.get("/options")
def get_ml_options():
    return {
        "models": {
            "logistic_regression": {
                "params": {
                    "max_iter": "int"
                }
            },
            "random_forest": {
                "params": {
                    "n_estimators": "int",
                    "max_depth": "int"
                }
            }
        }
    }


@router.post("/train")
def train_model(request: MLRequest):
    try:
        result = MLService.train_model(
            filename=request.filename,
            target=request.target,
            model_type=request.model_type,
            params=request.params
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return result