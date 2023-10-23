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
import uuid


@pytest.mark.asyncio
async def test_jobs_creation():
    random_uuid = uuid.uuid4()

    test_data = {
        "jobId": f"{random_uuid}",
        "symbol": "TSLA",
        "amountValidated": 1,
        "startingDate": "2023-10-15T00:31:02.172Z"
    }

    # -----
    # Enviar request

    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.post("/job", json=test_data)
    assert response.status_code == 201

    response_data = response.json()

    assert response_data["job_id"] == test_data["jobId"]
    assert response_data["status"] == "PENDING"


@pytest.mark.asyncio
async def test_jobs_pending():
    random_uuid = uuid.uuid4()

    test_data = {
        "jobId": f"{random_uuid}",
        "symbol": "TSLA",
        "amountValidated": 1,
        "startingDate": "2023-10-15T00:31:02.172Z"
    }

    # -----
    # Enviar request

    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.post("/job", json=test_data)

    # -----
    # Revisar que esté esperando

    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.get(f"/job/{test_data['jobId']}")
    assert response.status_code == 200
    assert response.json() == {
        "job_id": test_data['jobId'],
        "stocks_predictions": -2147483648,
        "status": "PENDING"
    }


@pytest.mark.asyncio
async def test_jobs_not_found():
    random_uuid = uuid.uuid4()

    test_data = {
        "jobId": f"{random_uuid}"
    }

    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.get(f"/job/{test_data['jobId']}")
    assert response.status_code == 404
    assert response.json() == {
        "job_id": test_data['jobId'],
        "stocks_predictions": -2147483648,
        "message": "Job not found"
    }


@pytest.mark.asyncio
async def test_jobs_success():
    random_uuid = uuid.uuid4()

    test_data = {
        "jobId": f"{random_uuid}",
        "symbol": "TSLA",
        "amountValidated": 1,
        "startingDate": "2023-10-15T00:31:02.172Z"
    }

    # -----
    # Enviar request

    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.post("/job", json=test_data)
    assert response.status_code == 201

    # Revisar que esté bien

    await asyncio.sleep(20)

    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.get(f"/job/{test_data['jobId']}")
    assert response.status_code == 200
    response_data = response.json()

    assert isinstance(response_data["job_id"], str)
    assert response_data["job_id"] == test_data["jobId"]
    assert response_data["status"] == "SUCCESS"
    assert isinstance(response_data["stocks_predictions"], float)


@pytest.mark.asyncio
async def test_get_heartbeat():
    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.get("/heartbeat")
    assert response.status_code == 200
    assert response.json() == {
        "message": True
    }