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
import dateutil.parser as dp

from utils import iso8601_to_epoch

# ------------------------------------

# Conexión a redis
redis_client = Redis(host='redis_workers', port=6379, db=0)


# ------------------------------------
# Intentar convertir al tipo correcto de variable desde el json
class NumberIn(BaseModel):
    number: int


class TaskIn(BaseModel):
    # Tarea de ejemplo:
    # {
    #     "name": <str>
    # }
    name: str


class CeleryJob(BaseModel):
    jobId: str
    symbol: str
    amountValidated: int
    startingDate: str  # ISO8601


# ------------------------------------


# ## Fast API
app = FastAPI()


# ------------------------------------

# Tests
@app.get("/")
def root() -> JSONResponse:
    content = {
        "message": "I am Root"
    }
    return JSONResponse(content=content, status_code=200)


@app.get("/add")
def add(val1: Optional[int] = None,
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


@app.post("/subtract")
def subtract(val1: NumberIn, val2: NumberIn):
    content = {
        "message": f"I am subtracting {val2.number} from {val1.number}",
        "result": val1.number - val2.number
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
            "task_id": "SampleTaskName",
            "status": "PENDING",
            "message": "I'm Done"
        }
        """

    task = celery_app.send_task("tasks.dummy_task",
                                args=[task_in.name])
    content = {
        "task_id": task.id,
        "status": task.status,
        "message": "I'm Done"
    }
    return JSONResponse(content=content, status_code=202)

    # ------------------------------------


@app.post("/job")
async def create_another_task(job: CeleryJob) -> JSONResponse:
    task = celery_app.send_task("tasks.linear_regression",
                                args=[job.jobId,  # str
                                      job.amountValidated,  # int
                                      job.symbol,
                                      job.startingDate  # str ISO8601
                                      ])

    content = {
        "job_id": job.jobId,  # str || UUID
        "tasks": {  # dict
            "task_id": task.id,  # str || UUID
            "status": task.status  # str
        }
    }

    return JSONResponse(content=content, status_code=201)


# https://realpython.com/python-redis/
@app.get("/job/{job_id}")
# TODO
async def job_status(job_id: str) -> JSONResponse:
    # Revisar si la llave existe y printear el valor

    out_data = {"job_id": job_id,
                "stocks_predictions": []}

    for key in redis_client.keys():
        if job_id in key:
            stocks_predictions = json.loads(redis_client.get(key))
            out_data["stocks_predictions"] = stocks_predictions

    content = dict()
    return JSONResponse(content=content, status_code=200)


@app.get("/heartbeat")
async def heartbeat() -> JSONResponse:
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
