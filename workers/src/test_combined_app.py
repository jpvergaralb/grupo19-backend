import pytest
from httpx import AsyncClient
from app import app
from tasks import app as celery_app
from logs import logger as log
from logs import print
from environment import env
from time import sleep
import pytest
from httpx import AsyncClient
import asyncio


@pytest.mark.asyncio
async def test_post_dummy_task_singlethreaded():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        task_name = "test_dummy_task"
        response = await ac.post("/dummy_task", json={"name": task_name})

        assert response.status_code == 202

        data = response.json()
        assert "task_id" in data
        assert "status" in data

        sleep(5)

        assert isinstance(celery_app.AsyncResult(data["task_id"]).result, str)


@pytest.mark.asyncio
async def test_post_dummy_task_multithreaded():
    async with AsyncClient(app=app, base_url="http://test") as ac:

        # Función interna para hacer la solicitud POST asincrónicamente
        async def send_request(task_name):
            response = await ac.post("/dummy_task", json={"name": task_name})
            assert response.status_code == 202
            data = response.json()
            assert "task_id" in data
            assert "status" in data
            return data["task_id"]

        task_name = "test_dummy_task"
        # Lanza 12 instancias asincrónicas de la solicitud POST
        # y recopila los task_ids
        task_ids = await asyncio.gather(*[send_request(f"{task_name}_{i}")
                                          for i in range(15)])

        await asyncio.sleep(15)

        # Verifica que cada tarea se haya completado exitosamente
        for task_id in task_ids:
            assert isinstance(celery_app.AsyncResult(task_id).result, str)
