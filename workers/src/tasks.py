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
redis_client = Redis(host=env['REDIS_HOST'], port=env['REDIS_PORT'], db=env['REDIS_DATABASE'])

redis_uri = f"{env['REDIS_PROTOCOL']}://{env['REDIS_HOST']}:{env['REDIS_PORT']}/{env['REDIS_DATABASE']}"


app = Celery('tasks',
             backend=redis_uri,
             broker=redis_uri)


# --------------------------------------------------
# Tareas de ejemplo

@app.task(name="tasks.add")
def add(x: Union[int, float], y: Union[int, float]) -> Union[int, float]:
    """
    --- Documentación por ChatGPT ---
    Tarea de Celery que suma dos números después de dormir durante un tiempo aleatorio.

    Params
    ----------
    :param x: Union[int, float]
        Primer número a sumar. Puede ser un entero o un decimal.
    :param y: Union[int, float]
        Segundo número a sumar. Puede ser un entero o un decimal.

    :return: Union[int, float]
    -------
        Resultado de la suma de x e y.

    Notas
    -----
    Esta tarea tiene un retraso introducido artificialmente mediante el método `sleep()`,
    que detiene la ejecución durante un tiempo aleatorio entre 0 y 3 segundos. Esta
    característica es útil para simular tareas que toman un tiempo variable para completarse.

    Ejemplo
    -------
    >>> result = add.delay(5, 7)
    >>> result.get(timeout=10)
    12
    """
    sleep(random() * 3)
    return x + y


@app.task(name="tasks.find_n_prime_slowly")
def find_prime_slowly(number: int) -> int:
    """
    --- Documentación por ChatGPT ---
    Tarea de Celery que encuentra el número primo más grande menor o igual a un número dado.

    Params
    ----------
    :param number: int
        Número hasta el cual se busca el número primo más grande.

    :return: int
    -------
        El número primo más grande que es menor o igual al número proporcionado.

    Notas
    -----
    La función utiliza una implementación simple y no optimizada para determinar si un número es primo.
    Puede ser lenta para valores grandes de `number`.

    Ejemplo
    -------
    >>> result = find_prime_slowly.delay(20)
    >>> result.get(timeout=10)
    19
    """
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
    """
    --- Documentación por ChatGPT ---
    Tarea de Celery simulada (dummy) que imprime mensajes y espera un tiempo aleatorio antes de finalizar.

    Params
    ----------
    :param name: str
        Nombre identificador para la tarea, que se incluirá en los mensajes impresos.

    :return: str
    -------
        Mensaje indicando la finalización de la tarea.

    Notas
    -----
    Esta función imprime un mensaje al inicio y al final de su ejecución y
    espera un tiempo aleatorio (entre 0 y 3 segundos) antes de finalizar.
    Es útil para simular una tarea sin realizar ningún trabajo real.

    Ejemplo
    -------
    >>> result = dummy_task.delay("TestTask")
    >>> result.get(timeout=10)
    "I'm Done"
    """
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
    """
    --- Documentación por ChatGPT ---
    Predice el precio futuro de una acción basado en los datos históricos
    y ajustado por la cantidad comprada.

    Params
    ----------
    :param job_id: str
        Identificador único para el trabajo en curso.
    :param amount_bought: int
        Cantidad de acciones compradas.
    :param company_symbol: str
        Símbolo de la compañía de la acción.
    :param starting_date_iso8601: str
        Fecha inicial en formato ISO 8601 desde la cual se comenzará a recopilar
        los datos.

    :return: float
    -------
        Precio esperado de la acción para el tiempo futuro calculado.

    Notas
    -----
    Esta función primero recopila datos históricos de la acción desde una API
    externa. Una vez recopilados los datos hasta la fecha de inicio
    proporcionada, se utiliza una función de regresión lineal para predecir
    el precio de la acción para una fecha futura. El tiempo futuro se calcula
    como el tiempo actual más la diferencia entre el tiempo actual y el tiempo
    de inicio. Finalmente, el precio previsto se ajusta por la cantidad de
    acciones compradas usando `math_operations.expected_stock_price_with_adjustment`.

    Ejemplo
    -------
    >>> result = linear_regression.delay("job123", 50, "AAPL", "2023-01-01T00:00:00Z")
    >>> result.get(timeout=600)
    123.45  # Este es solo un valor ilustrativo, no es el resultado real.
    """

    # Declaro y defino variables

    prices = dict()
    reached_starting_date = False
    page_counter = 1
    starting_time_epoch: int = iso8601_to_epoch(starting_date_iso8601)

    # Función para descargar datos desde la API
    def fetch_data(company: str, current_page, page_size: int = env["QUERY_FETCH_SIZE"]):
        url = f'{env["MAIN_API_URI"]}' \
              f'stocks/{company}' \
              f'?size={page_size}' \
              f'&page={current_page}'
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }

        response = requests.get(url, headers=headers)

        return response.json()

    # Pedir datos hasta que se llegue a la fecha límite
    # o no hayan más datos en la API
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
