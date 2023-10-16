from random import random
from time import sleep
from typing import Union

from celery import Celery
from redis import Redis

app = Celery('tasks',
             backend='redis://redis_workers:6379/0',
             broker='redis://redis_workers:6379/0')



# --------------------------------------------------
# Tareas de ejemplo

@app.task(name="tasks.add")
def add(x: Union[int, float], y: Union[int, float]) -> Union[int, float]:
    sleep(random() * 3)
    return x + y


@app.task(name="tasks.find_n_prime_slowly")
def find_prime_slowly(number: int) -> int:
    def is_prime(n):
        if n <= 1:
            return False
        for i in range(2, int(n ** 0.5) + 1):
            if n % i == 0:
                return False
        return True

    def calc_prime(num_max):
        primes = []
        for num in range(2, num_max + 1):
            if is_prime(num):
                primes.append(num)
        return primes

    return calc_prime(number)[-1]


@app.task(name="tasks.dummy_task")
def dummy_task(name: str) -> str:
    print(f"Dummy task starting: {name}")
    sleep(random() * 3)
    print(f"Dummy task executed: {name}")
    return "I'm Done"

# --------------------------------------------------


@app.task(name="tasks.linear_regression")
def linear_regression():
    pass

