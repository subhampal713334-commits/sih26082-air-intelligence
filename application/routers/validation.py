from fastapi import APIRouter, Depends

from dataloader import DataStore, get_store
from services.validation_service import validation_summary

router = APIRouter(prefix="/validation", tags=["validation"])


@router.get("", summary="Model validation metrics and inventory")
def validation(store: DataStore = Depends(get_store)):
    return validation_summary(store)
