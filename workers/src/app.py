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
    """
    --- Documentación por ChatGPT ---
    Endpoint que devuelve un mensaje simple para verificar que el
    servicio está en funcionamiento.

    Route
    -----
    GET /

    Respuesta
    --------
    JSONResponse
        Un objeto JSONResponse que devuelve un mensaje simple.

    Campos de respuesta
    -------------------
    "message": str
        Un mensaje que indica "I am Root", útil para verificaciones
        rápidas del funcionamiento del servicio.

    Ejemplo de respuesta
    -------------------
    {
        "message": "I am Root"
    }

    Ejemplo
    -------
    >>> response = requests.get("https://yourapi.com/")
    >>> response.json()
    {
        "message": "I am Root"
    }
    """
    content = {
        "message": "I am Root"
    }
    return JSONResponse(content=content, status_code=200)


@app.get("/add")
def add(val1: Optional[int] = None,
        val2: Optional[int] = None) -> JSONResponse:
    """
    --- Documentación por ChatGPT ---
    Endpoint que suma dos valores proporcionados como parámetros de
    consulta.

    Route
    -----
    GET /add

    Parámetros de consulta
    ----------------------
    val1 : int, opcional
        Primer valor a sumar.
    val2 : int, opcional
        Segundo valor a sumar.

    Respuesta
    --------
    JSONResponse
        Un objeto JSONResponse que contiene el resultado de la suma o un
        mensaje
        indicando la necesidad de proporcionar valores para sumar.

    Campos de respuesta
    -------------------
    "message": str
        Un mensaje indicando la operación realizada o la necesidad de
        proporcionar valores.
    "result": int, opcional
        El resultado de la suma de val1 y val2, si se proporcionaron
        ambos valores.

    Ejemplo de respuesta
    -------------------
    - Si se proporcionan ambos valores:
    {
        "message": "I am adding 3 and 4",
        "result": 7
    }

    - Si no se proporciona al menos uno de los valores:
    {
        "message": "I should add something"
    }

    Ejemplo
    -------
    >>> response = requests.get("https://yourapi.com/add?val1=3&val2=4")
    >>> response.json()
    {
        "message": "I am adding 3 and 4",
        "result": 7
    }
    """
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
    """
    --- Documentación por ChatGPT ---
    Endpoint que resta dos números proporcionados en el cuerpo de la
    petición.

    Route
    -----
    POST /subtract

    Parámetros de cuerpo (body parameters)
    --------------------------------------
    val1 : NumberIn
        Primer número desde el cual se restará.
    val2 : NumberIn
        Segundo número que será restado del primero.

    Respuesta
    --------
    JSONResponse
        Un objeto JSONResponse que contiene el resultado de la resta.

    Campos de respuesta
    -------------------
    "message": str
        Un mensaje indicando la operación realizada.
    "result": int
        El resultado de restar val2 de val1.

    Ejemplo de respuesta
    -------------------
    {
        "message": "I am subtracting 4 from 10",
        "result": 6
    }

    Ejemplo
    -------
    >>> data = {
    ...     "val1": {"number": 10},
    ...     "val2": {"number": 4}
    ... }
    >>> response = requests.post("https://yourapi.com/subtract", json=data)
    >>> response.json()
    {
        "message": "I am subtracting 4 from 10",
        "result": 6
    }
    """
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
