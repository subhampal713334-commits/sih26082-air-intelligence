from fastapi import APIRouter, Depends

from dataloader import DataStore, get_store
from services.alert_service import list_alerts

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("", summary="Alert center feed")
def alerts(
    station_id: str | None = None,
    severity: str | None = None,
    limit: int = 100,
    store: DataStore = Depends(get_store),
):
    return list_alerts(store, station_id=station_id, severity=severity, limit=limit)
