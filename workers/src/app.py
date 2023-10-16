from starlette.responses import JSONResponse

from logs import logger as log
from logs import print
from environment import env

from pydantic import BaseModel
from fastapi import Depends, FastAPI, Header, HTTPException, Path, Query
from tasks import app as celery_app
import asyncio
import json
from random import randint
from typing import List, Union, Optional
import requests
from time import sleep
from fastapi.responses import JSONResponse
from redis import Redis
from celery.result import AsyncResult

# ------------------------------------

# Conexión a redis
redis_client = Redis(host='redis_workers', port=6379, db=0)


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
    # {
    #   "task_id": <int>
    #   "stocks_predictions": [
    #     {
    #       "starting_date_epoch": <int>,
    #       "stock_symbol": <str>,
    #       "amount_bought": <int>
    #     },
    #     ...,
    #     {
    #       "starting_date_epoch": <int>,
    #       "stock_symbol": <str>,
    #       "amount_bought": <int>
    #     }
    #   ]
    # }
    task_id: str
    stocks_predictions: List[StocksData]


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
    """
        --- Documentación por ChatGPT ---
        Endpoint que inicia una tarea dummy en segundo plano usando Celery.

        Route
        -----
        POST /dummy_task

        Parámetros de entrada
        ---------------------
        task_in: TaskIn
            Objeto que contiene los detalles necesarios para iniciar la
            tarea, como el nombre de la tarea.

        Respuesta
        --------
        JSONResponse
            Un objeto JSONResponse que contiene detalles sobre la tarea
            iniciada, como el ID y el estado de la tarea.

        Campos de respuesta
        ------------------
        "task_id": str
            El identificador único de la tarea generada por Celery.
        "status": str
            Estado actual de la tarea (por ejemplo, "PENDING", "STARTED", etc.)
        "message": str
            Mensaje adicional relacionado con la tarea, en este caso siempre
            retorna "I'm Done".

        Notas
        -----
        Este endpoint utiliza Celery para iniciar tareas en segundo plano.
        La tarea `dummy_task` es una tarea de ejemplo que se ejecuta de
        forma asincrónica y el estado y el ID de la tarea se devuelven
        inmediatamente al llamante.

        Ejemplo
        -------
        >>> data = {
        ...     "name": "SampleTaskName"
        ... }
        >>> response = requests.post("https://yourapi.com/dummy_task",
        json=data)
        >>> response.json()
        {
            "task_id": "f4b469fa-2457-4b5c-a4aa-2e2f2b3b5e7c",
            "status": "PENDING",
            "message": "I'm Done"
        }
        """
    task = celery_app.send_task("tasks.dummy_task",
                                args=[task_in.name])
    content = {
        "task_id": task.id,
        "status": task.status
    }
    return JSONResponse(content=content, status_code=202)

# ------------------------------------


@app.post("/job/")
async def create_another_task(jobs: CeleryJob) -> JSONResponse:
    tasks: List[AsyncResult] = list()

    for stock_prediction_request in jobs.stocks_predictions:
        tasks.append = celery_app.send_task(
            "task.linear_regression",
            args=[stock_prediction_request.starting_date_epoch,
                  stock_prediction_request.stock_symbol,
                  stock_prediction_request.amount_bought])

    # ---- Status codes: ----
    # PENDING: La tarea está esperando a ser procesada.
    # STARTED: La tarea ha comenzado su ejecución.
    # RETRY: La tarea está siendo reintentada, posiblemente debido a un
    #     fallo durante la ejecución.
    # FAILURE: La tarea no ha podido completarse con éxito.
    # SUCCESS: La tarea se ha completado con éxito.
    # RECEIVED: La tarea ha sido recibida por un worker (proceso de
    #     trabajo), pero aún no ha comenzado su ejecución.
    # REVOKED: La tarea ha sido cancelada antes de su ejecución.
    # REJECTED: La tarea ha sido rechazada por algún motivo, por lo
    #     general, esto sucede si hay un problema con el worker o con
    #     la configuración.
    content = {"tasks": [{"task_id": task.id, "status": task.status}
                         for task in tasks]}

    return JSONResponse(content, status_code=201)


@app.get("/job/{job_id}")
# TODO
async def job_status(job_id: str) -> JSONResponse:
    content = {_: _, }
    return JSONResponse(content=content, status_code=200)


@app.get("/heartbeat")
async def add() -> JSONResponse:
    """
        --- Documentación por ChatGPT ---
        Endpoint que verifica la salud o "heartbeat" de la aplicación.

        Route
        -----
        GET /heartbeat

        Respuesta
        --------
        JSONResponse
            Un objeto JSONResponse que indica si la aplicación está
            funcionando correctamente.

        Campos de respuesta
        ------------------
        "message": bool
            Un valor booleano que indica la salud de la aplicación. Si es
            `True`, significa que la aplicación está funcionando correctamente.

        Ejemplo de respuesta
        -------------------
        {
            "message": True
        }

        Notas
        -----
        Este endpoint se utiliza comúnmente en infraestructuras y
        despliegues para comprobar la salud o "heartbeat" de un servicio. Si
        el servicio devuelve `True`, indica que está funcionando como se
        espera.

        Ejemplo
        -------
        >>> response = requests.get("https://yourapi.com/heartbeat")
        >>> response.json()
        {
            "message": True
        }
        """
    content = {
        "message": True
    }
    return JSONResponse(content=content, status_code=200)
