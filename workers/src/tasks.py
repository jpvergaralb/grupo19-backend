from environment import env
from logs import logger as log
from logs import print

from celery import Celery
from redis import Redis


# celery_broker = f"{env['REDIS_PROTOCOL']}://{env['REDIS_HOST']}:{env['REDIS_PORT']}/{env['REDIS_DATABASE']}"

celery_app = Celery('tasks')
# celery_app = Celery('tasks', broker=celery_broker, backend=celery_broker)
# celery_app = Celery('tasks', broker=celery_broker)
# redis_client = Redis(host=f"{env['REDIS_HOST']}", port=env["REDIS_PORT"], db=env['REDIS_DATABASE'])


# @celery_app.task(name="task.nombre_de_la_funcion")
# def nombre_de_la_funcion(variable):
#     print(variable)
#     return variable
#
#
# @celery_app.task(name="task.suma_de_dos_variables")
# def suma_de_dos_variables(variable_1: int, variable_2: int) -> int:
#     res = variable_1 + variable_2
#     print(f"{variable_1} + {variable_2} = {res}")
#     return res


