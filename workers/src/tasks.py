from celery import Celery

app = Celery('tasks',
             backend='redis://redis_workers:6379/0',
             broker='redis://redis_workers:6379/0')

@app.task
def add(x, y):
    return x + y