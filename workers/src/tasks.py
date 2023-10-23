from logs import logger as log
from logs import print
from environment import env

from random import random, randint
from time import sleep, time
from typing import Union, List
from time import sleep
import requests

from celery import Celery
from redis import Redis

from utils import iso8601_to_epoch
import math_operations
import numpy as np
import json

# Conexión a redis
redis_client = Redis(host='redis_workers', port=6379, db=0)

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
def linear_regression(job_id: str,
                      amount_bought: int,
                      company_symbol: str,
                      starting_date_iso8601: str):

    prices = dict()
    reached_starting_date = False
    page_counter = 1
    starting_time_epoch: int = iso8601_to_epoch(starting_date_iso8601)

    def fetch_data(company: str, current_page, page_size: int = 100):
        url = f'https://api.arqui.ljg.cl/' \
              f'stocks/{company}' \
              f'?size={page_size}' \
              f'&page={current_page}'
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }

        response = requests.get(url, headers=headers)

        return response.json()

    while not reached_starting_date:
        current_response = fetch_data(company_symbol, page_counter)

        # {'stock': [
        #     {'id': 99079, 'symbol': 'AAPL', 'shortName': 'Apple Inc.',
        #               'price': 172.88, 'currency': 'USD',
        #               'source': 'Nasdaq Real Time Price',
        #               'createdAt': '2023-10-22T01:04:49.460Z',
        #               'updatedAt': '2023-10-22T01:04:49.460Z'},
        #     {'id': 99064, 'symbol': 'AAPL', 'shortName': 'Apple Inc.',
        #               'price': 172.88, 'currency': 'USD',
        #               'source': 'Nasdaq Real Time Price',
        #               'createdAt': '2023-10-22T00:59:49.411Z',
        #               'updatedAt': '2023-10-22T00:59:49.411Z'}
        # ]}

        if "stock" not in current_response.keys():
            break

        for stock in current_response["stock"]:
            creation_time = iso8601_to_epoch(stock["createdAt"])
            stock_price = stock["price"]

            if starting_time_epoch > creation_time:
                reached_starting_date = True
                break

            prices[creation_time] = stock_price

        page_counter += 1

    # +--------------------------------+

    now = int(time())
    delta_time = now - starting_time_epoch
    the_future = now + delta_time

    expected_price = math_operations.expected_stock_price_with_adjustment(
        prices,
        the_future,
        amount_bought)

    # +--------------------------------+
    # data_out = {
    #     "expected_price": expected_price,
    #     "amount_bought": amount_bought,
    #     "company_symbol": company_symbol,
    #     "times": {
    #         "starting_time": starting_time_epoch,
    #         "run_at": now,
    #         "delta_time": delta_time
    #     }
    # }
    #
    # log.debug(f"""
    # data_out = <[
    #     "expected_price": {expected_price},
    #     "amount_bought": {amount_bought},
    #     "company_symbol": {company_symbol},
    #     "times": <[
    #         "starting_time": {starting_time_epoch},
    #         "run_at": {now},
    #         "delta_time": {delta_time}
    #     ]>
    # ]>
    # """)

    # json_string = json.dumps(data_out)
    # json_bytes = json_string.encode('utf-8')

    log.debug(f"Guardando en redis: {expected_price}")

    # try:
    #     task_extra_numbers = randint(10000, 99999)
    #     redis_client.set(f"{job_id}-{task_extra_numbers}", json_bytes)
    #
    # except Exception as e:
    #     log.error(f"Error saving data to Redis: {e}")
    #
    # finally:
    #     log.debug("Retornando por si acaso")
    #     return expected_price

    return expected_price
