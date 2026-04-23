from fastapi import APIRouter, HTTPException
from src.api.dto.request.etl_request import ETLRequest
from src.api.dto.response.etl_response import ETLResponse
from src.services.etl_service import ETLService

router = APIRouter(prefix="/etl", tags=["ETL"])


@router.get("/options")
def get_etl_options():
    return {
        "cleaning": {
            "drop_na": [True, False],
            "fill_na": ["mean", "median", "mode", None]
        },
        "encoding": {
            "encode_categorical": [True, False]
        },
        "scaling": {
            "scale_numeric": ["standard", "minmax", None]
        }
    }


@router.post("/process", response_model=ETLResponse)
def process_data(request: ETLRequest):
    try:
        result = ETLService.process(
            filename=request.filename,
            steps=request.steps.dict()
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return ETLResponse(
        filename=request.filename,
        processed_filename=result["processed_filename"],
        records_count=result["records_count"],
    )