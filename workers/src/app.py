from logs import logger as log
from logs import print
from environment import env

from pydantic import BaseModel
from fastapi import Depends, FastAPI, Header, HTTPException, Path, Query
from tasks import app as celery_app, redis_client
import asyncio
import json
from random import randint
from typing import List, Union
import requests


# ------------------------------------
# Intentar convertir al tipo correcto de variable desde el json
class TaskIn(BaseModel):
    name: str


class StocksData(BaseModel):
    starting_date_epoch: int
    stock_symbol: str


class CeleryJob(BaseModel):
    JobId: str
    challenges: List[StocksData]


# ------------------------------------


# ## Fast API
app = FastAPI()


# ------------------------------------

# Tests
@app.get("/")
async def root() -> dict:
    return {
        "code": 200,
        "message": "I am Root"
    }

# ------------------------------------

