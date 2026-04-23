from fastapi import APIRouter, HTTPException
from src.pipelines.full_pipeline import FullPipeline

router = APIRouter(prefix="/pipeline", tags=["Pipeline"])

@router.post("/full")
def run_full_pipeline(request: dict):
    try:
        result = FullPipeline.run(
            etl_request=request["etl"],
            ml_request=request["ml"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return result