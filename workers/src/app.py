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
from redis import Redis
from celery.result import AsyncResult
import dateutil.parser as dp

from utils import iso8601_to_epoch


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
    """
    --- Documentación por ChatGPT ---
    Endpoint que crea una nueva tarea asincrónica de Celery para
    realizar una regresión lineal y la almacena en Redis.

    Route
    -----
    POST /job

    Parámetros de cuerpo (body parameters)
    --------------------------------------
    job : CeleryJob
        Información de la tarea que se desea crear, incluyendo detalles
        como el ID del trabajo (jobId), la cantidad validada (amountValidated),
        el símbolo de la acción (symbol) y la fecha de inicio (startingDate)
        en formato ISO8601.

    Respuesta
    ---------
    JSONResponse
        Un objeto JSONResponse que contiene información sobre la tarea
        creada.

    Campos de respuesta
    -------------------
    - "job_id": str || UUID
        ID del trabajo proporcionado en la solicitud.
    - "status": str
        Estado de la tarea de Celery (por ejemplo, "PENDING").

    Ejemplo de respuesta
    --------------------
    {
        "job_id": "a1234bc5-d6e7-890f-ghij-klmno1234567",
        "status": "PENDING"
    }

    Ejemplo de uso
    --------------
    >>> import requests
    >>> data = {
    ...     "jobId": "a1234bc5-d6e7-890f-ghij-klmno1234567",
    ...     "amountValidated": 500,
    ...     "symbol": "AAPL",
    ...     "startingDate": "2023-10-22T10:15:30Z"
    ... }
    >>> response = requests.post("https://yourapi.com/job", json=data)
    >>> response.json()
    {
        "job_id": "a1234bc5-d6e7-890f-ghij-klmno1234567",
        "status": "PENDING"
    }

    Notas
    -----
    1. Antes de enviar la tarea a Celery, la función almacena un objeto
       inicial de tarea en Redis con un estado "PENDING".
    2. Si hay algún problema al guardar el objeto de tarea en Redis, se
       registra un error.
    """

    # +--------------------------------+
    # Guadando datos de tarea en Redis

    log.debug("Guadando datos de tarea en Redis")

    # +---------------------------------+------------------------------------+
    # | b'celery-task-meta-{job.jobId}' | b"{'status': 'PENDING', 'resul..." |
    # +---------------------------------+------------------------------------+

    task_data = {'status': 'PENDING',
                 'result': -2147483648,
                 'traceback': None,
                 'children': [],
                 'date_done': None,
                 'task_id': f'{job.jobId}'}

    json_string = json.dumps(task_data)
    json_bytes = json_string.encode('utf-8')
    task_name = f'celery-task-meta-{job.jobId}'.encode(encoding='utf-8')

    try:
        redis_client.set(task_name, json_bytes)

    except Exception as e:
        log.error(f"Error saving data to Redis: \n{e}")

    # +--------------------------------+
    # Creando tarea

    log.debug("Creando tarea")

    task = celery_app.send_task("tasks.linear_regression",
                                args=[job.jobId,  # str
                                      job.amountValidated,  # int
                                      job.symbol,
                                      job.startingDate  # str ISO8601
                                      ],
                                task_id=job.jobId)

    content = {
        "job_id": job.jobId,  # str || UUID
        "status": task.status  # str
    }

    return JSONResponse(content=content, status_code=201)


# https://realpython.com/python-redis/
@app.get("/job/{job_id}")
async def job_status(job_id: str) -> JSONResponse:
    """
    --- Documentación por ChatGPT ---
    Endpoint que devuelve el estado y los resultados de una tarea asincrónica
    de Celery a partir de su ID.

    Route
    -----
    GET /job/{job_id}

    Parámetros del path
    -------------------
    job_id : str
        ID del trabajo asincrónico de Celery cuyo estado y resultados se desea
        consultar.

    Respuesta
    --------
    JSONResponse
        Un objeto JSONResponse que contiene información sobre el estado y los
        resultados de la tarea.

    Campos de respuesta
    -------------------
    "job_id": str
        ID del trabajo asincrónico de Celery.
    "stocks_predictions": int || float
        Predicciones de acciones o precios esperados para el trabajo.
        Retorna -2147483648 si el trabajo no se encuentra.
    "status": str
        Estado de la tarea de Celery.
    "message": str [Opcional]
        Mensaje adicional en caso de que el trabajo no se encuentre.

    Ejemplo de respuesta (Tarea encontrada)
    --------------------------------------
    {
        "job_id": "a1234bc5-d6e7-890f-ghij-klmno1234567",
        "stocks_predictions": 150.52,
        "status": "SUCCESS"
    }

    Ejemplo de respuesta (Tarea no encontrada)
    -----------------------------------------
    {
        "job_id": "a1234bc5-d6e7-890f-ghij-klmno1234567",
        "stocks_predictions": -2147483648,
        "message": "Job not found"
    }

    Ejemplo
    -------
    Ejemplo
    -------
    >>> import requests
    >>> job_id_query = "a1234bc5-d6e7-890f-ghij-klmno1234567"
    >>> response = requests.get(f"http://localhost:8000/job/{job_id_query}")
    >>> response.json()
    {'job_id': 'a1234bc5-d6e7-890f-ghij-klmno1234567',
    'stocks_predictions': 150.52,
    'status': 'SUCCESS'}

    Notas
    -----
    La función busca el trabajo en una base de datos Redis usando el prefijo
    'celery-task-meta-' junto con el ID del trabajo. Si no se encuentra ninguna
    coincidencia, se devuelve un código de estado 404 y un mensaje indicando
    que el trabajo no fue encontrado.
    """

    log.debug(f"Buscando tarea: celery-task-meta-{job_id}")

    keys = [key.decode('utf-8')
            for key in redis_client.scan_iter(f"*")
            if job_id in key.decode('utf-8')]

    log.debug(f"Trabajo(s) encontrado: {keys}")

    if not keys:
        content = {"job_id": job_id,
                   "stocks_predictions": -2147483648,
                   "message": "Job not found"}
        status_code = 404

    else:
        log.debug(f"Tomando el primero de la lista")

        job_id = keys[0]
        job_data = redis_client.get(job_id)

        log.debug(f"Convirtiendo de bytes a dict")
        job_data = job_data.decode("utf-8")
        job_data = json.loads(job_data)

        log.debug(f"Trabajo encontrado: {job_data}")

        status_code = 200

        # if "result" in job_data.keys():
        #     content = {"job_id": job_id,
        #                "stocks_predictions": job_data["result"]}
        #
        # else:
        #     content = {"job_id": job_id,
        #                "stocks_predictions": job_data["expected_price"]}

        content = {"job_id": job_id.strip("celery-task-meta-"),
                   "stocks_predictions": job_data["result"],
                   "status": job_data["status"]}

    return JSONResponse(content=content, status_code=status_code)


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
