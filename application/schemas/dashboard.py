from typing import Any

from pydantic import BaseModel, ConfigDict


class APIEnvelope(BaseModel):
    model_config = ConfigDict(extra="allow")

    data: Any
