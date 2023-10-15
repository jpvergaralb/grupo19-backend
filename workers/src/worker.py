from environment import env
from logs import logger as log
from logs import print

from celery import Celery
# from redis import Redis


celery_app = Celery('tasks', broker=env["CELERY_BROKER_URL"], backend=env["CELERY_RESULT_BACKEND"])
# redis_client = Redis(host=f"{env['REDIS_HOST']}", port=env["REDIS_PORT"], db=env['REDIS_DATABASE'])

