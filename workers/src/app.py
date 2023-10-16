from fastapi import FastAPI

from environment import env
from logs import logger as log
from logs import print
from pydantic import BaseModel

from tasks import suma_de_dos_variables, celery_app

app = FastAPI()

class TaskIn(BaseModel):
    name: str

# Tests
@app.get("/")
def root() -> dict:
    return {
        "code": 200,
        "message": "I am gRoot"
    }




@app.post("/task/")
def create_task(task_in: TaskIn):
    task = celery_app.send_task("task.do_something",
                                args=[task_in.name])
    return {"task_id": task.id, "status": task.status}





@app.get("/test/{num1}/{num2}")
def prueba_con_suma(num1: str, num2: str) -> dict:
    res = suma_de_dos_variables.delay(int(num1), int(num2))

    # res = "..."

    return {
        "code": 200,
        "message": "Resultado: " + str(res)
    }

# ---------------------


@app.get("/job/{job_id}")
def placeholder_func_1(job_id: str) -> None:
    pass


@app.post("/job")
def placeholder_func_2() -> None:
    pass


@app.get("/heartbeat")
def heartbeat() -> dict:
    return {
        "message": True
    }

log.info("Starting worker API")
