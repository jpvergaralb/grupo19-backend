from random import random
from time import sleep

from celery import Celery
from redis import Redis

app = Celery('tasks',
             backend='redis://redis_workers:6379/0',
             broker='redis://redis_workers:6379/0')
redis_client = Redis(host='redis_workers', port=6379, db=0)


# --------------------------------------------------

# Tarea de ejemplo
@app.task(name="tasks.add")
def add(x, y):
    sleep(random() * 3)
    return x + y

# --------------------------------------------------

@app.task(name="tasks.linear_regression")
def linear_regression():
    pass

