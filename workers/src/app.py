from starlette.responses import JSONResponse

from logs import logger as log
from logs import print
from environment import env

from pydantic import BaseModel
from fastapi import Depends, FastAPI, Header, HTTPException, Path, Query
from tasks import app as celery_app, redis_client
import asyncio
import json
from random import randint
from typing import List, Union, Optional
import requests
from time import sleep
from fastapi.responses import JSONResponse


# ------------------------------------
# Intentar convertir al tipo correcto de variable desde el json
class TaskIn(BaseModel):
    # Tarea de ejemplo:
    # {
    #     "name": <str>
    # }
    name: str


class StocksData(BaseModel):
    starting_date_epoch: int
    stock_symbol: str
    amount_bought: int


class CeleryJob(BaseModel):
    # Tarea con calculos de stocks
    JobId: str
    StockPredictions: List[StocksData]


# ------------------------------------


# ## Fast API
app = FastAPI()


# ------------------------------------

# Tests
@app.get("/")
async def root() -> JSONResponse:
    content = {
        "message": "I am Root"
    }
    return JSONResponse(content=content, status_code=200)


@app.get("/add")
async def add(val1: Optional[int] = None,
              val2: Optional[int] = None) -> JSONResponse:
    if None in (val1, val2):
        content = {
            "message": "I should add something"
        }
        return JSONResponse(content=content, status_code=204)

    content = {
        "message": f"I am adding {val1} and {val2}",
        "result": val1 + val2
    }
    return JSONResponse(content=content, status_code=200)


@app.post("/dummy_task")
def create_task(task_in: TaskIn) -> JSONResponse:
    task = celery_app.send_task("tasks.dummy_task",
                                args=[task_in.name])
    content = {
        "task_id": task.id,
        "status": task.status
    }
    return JSONResponse(content=content, status_code=202)

# ------------------------------------

@app.get("/job/{job_id}")
async def job(job_id: str) -> dict:
    out_data = {
        "JobId": job_id,
    }


@app.get("/heartbeat")
async def add() -> dict:
    return {
        "message": True
    }
