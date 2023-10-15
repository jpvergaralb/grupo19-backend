from environment import env
from logs import logger as log
from logs import print

# from worker import celery_app, redis_client
from worker import celery_app


@celery_app.task(name="task.nombre_de_la_funcion")
def nombre_de_la_funcion(variable):
    print(variable)
    return variable


@celery_app.task(name="task.suma_de_dos_variables")
def suma_de_dos_variables(variable_1: int, variable_2: int) -> int:
    res = variable_1 + variable_2
    print(f"{variable_1} + {variable_2} = {res}")
    return res










