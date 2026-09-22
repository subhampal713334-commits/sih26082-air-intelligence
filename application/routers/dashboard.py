from fastapi import APIRouter, Depends

from dataloader import DataStore, get_store
from services.overview_service import overview

router = APIRouter(tags=["dashboard"])


@router.get("/overview", summary="Dashboard overview for latest available artifact timestamp")
@router.get("/dashboard", summary="Complete dashboard payload")
def get_overview(store: DataStore = Depends(get_store)):
    return overview(store)
