# src/api/routes/models_route.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.db.database import get_db
from src.services.models_service import ModelsService

router = APIRouter(prefix="/models", tags=["Models"])


@router.get("/default")
def get_default_model(db: Session = Depends(get_db)):
    result = ModelsService.get_default_model(db)

    if not result:
        raise HTTPException(status_code=404, detail="No default model set")

    return result


@router.post("/default")
def set_default_model(request: dict, db: Session = Depends(get_db)):
    model_name = request.get("model_name")

    if not model_name:
        raise HTTPException(status_code=400, detail="model_name is required")

    result = ModelsService.set_default_model(db, model_name)

    return {
        "message": "Default model set",
        "model_name": result.model_name
    }


@router.get("/")
def list_models(db: Session = Depends(get_db)):
    return ModelsService.list_models(db)