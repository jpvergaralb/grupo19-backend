from logs import logger as log
from logs import print
from environment import env

from celery import Celery
from time import sleep

app = Celery('tasks',
             backend='redis://redis_workers:6379/0',
             broker='redis://redis_workers:6379/0')


@app.task(name="tasks.add")
def add(x, y):
    return x + y


