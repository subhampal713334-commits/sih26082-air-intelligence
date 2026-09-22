from fastapi import APIRouter, Depends

from dataloader import DataStore, get_store
from services.fire_service import fire_context

router = APIRouter(prefix="/fire", tags=["fire"])


@router.get("", summary="Regional fire/stubble-burning integration status")
def fire(store: DataStore = Depends(get_store)):
    return fire_context(store)
