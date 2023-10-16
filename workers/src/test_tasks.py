import pytest
from unittest.mock import patch

from tasks import add, linear_regression


# -----------------------------------------------------------------
# Configuraciones para pytest-celery (si decides usarlo)

# Setea el broker y backend a 'memory' para pruebas.
# Puede ir en un archivo conftest.py o directamente en test_tasks.py
@pytest.fixture(scope='session')
def celery_config():
    return {
        'broker_url': 'memory://',
        'result_backend': 'memory://'
    }


# -----------------------------------------------------------------

def test_add():
    # Usa apply() para ejecutar la tarea de forma síncrona.
    result = add.apply((2, 3))
    assert result.result == 5


# -----------------------------------------------------------------
