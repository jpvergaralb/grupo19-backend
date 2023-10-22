import pytest
from unittest.mock import patch

from tasks import add, find_prime_slowly


# -----------------------------------------------------------------
# Configuraciones para pytest-celery
# Setear el broker y backend a 'memory' para pruebas.
@pytest.fixture(scope='session')
def celery_config():
    return {
        'broker_url': 'redis://localhost:6379/0',
        'result_backend': 'redis://localhost:6379/0'
    }


# -----------------------------------------------------------------

def est_add():
    # Usa apply() para ejecutar la tarea de forma síncrona.
    result = add.apply((2, 3))
    assert result.result == 5


def est_find_prime_slowly():
    # Usa apply() para ejecutar la tarea de forma síncrona.
    result = find_prime_slowly.apply((1000000,))
    assert result.result == 999983


@pytest.mark.asyncio
async def est_find_prime_slowly_celery():
    inputs = [103000, 270000]
    expected_outputs = [102983, 269987]

    # Enviar las tareas asincrónicamente usando Celery
    async_results = [find_prime_slowly.delay(inp) for inp in inputs]

    # Esperar y recolectar los resultados
    results = [async_result.get() for async_result in async_results]

    assert results == expected_outputs

# -----------------------------------------------------------------
