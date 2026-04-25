from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from src.api.dto.request.predict_request import PredictRequest
from src.api.dto.response.predict_response import PredictResponse
from src.services.predict_service import PredictService
from src.db.database import get_db
from src.db.models import Prediction

router = APIRouter(prefix="/predict", tags=["Predict"])

@router.get("/history")
def get_predictions(db: Session = Depends(get_db)):
    return db.query(Prediction).order_by(Prediction.created_at.desc()).all()

@router.post("/", response_model=PredictResponse)
def predict(request: PredictRequest, db: Session = Depends(get_db)):
    print("Triggering prediction with data:", request.data)
    try:
        result = PredictService.predict(
            db=db,
            model_name=request.model_name,
            data=request.data
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return PredictResponse(
        prediction=result["prediction"],
        probability=result["probability"]
    )