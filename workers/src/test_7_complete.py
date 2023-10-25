import asyncio
import uuid

import pytest
from httpx import AsyncClient

from app import app


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
        await async_client.post("/job", json=test_data)

    # -----
    # Revisar que esté esperando

    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.get(f"/job/{test_data['jobId']}")
    assert response.status_code == 200
    response_data = response.json()

    assert response_data["message"] == "Job found"
    assert response_data["status"] == "PENDING"
    assert response_data["job_id"] == test_data["jobId"]

    job_data = response_data["job_data"]
    assert job_data["stocks_predictions"] == 0
    assert job_data["amount_bought"] >= 0
    assert isinstance(job_data["amount_bought"], int)
    assert job_data["company_symbol"] == test_data["symbol"]

    job_times = job_data["times"]
    assert job_times["prediction_starting_time"] == test_data["startingDate"]
    assert job_times["run_at"] != "1970-01-01T00:00:00Z"
    assert isinstance(job_times["run_at"], str)
    assert job_times["prediction_future_time"] != "1970-01-01T00:00:00Z"
    assert isinstance(job_times["prediction_future_time"], str)
    assert job_times["delta_time_seconds"] > 0
    assert isinstance(job_times["delta_time_seconds"], int)

    for time_stamp, price in job_data["price_history"]:
        assert time_stamp != "1970-01-01T00:00:00Z"
        assert isinstance(time_stamp, str)
        assert price not in (0, -2147483648)
        assert isinstance(price, float)


@pytest.mark.asyncio
async def test_jobs_not_found():
    random_uuid = uuid.uuid4()

    test_data = {
        "jobId": f"{random_uuid}"
    }

    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.get(f"/job/{test_data['jobId']}")
    assert response.status_code == 404
    response_data = response.json()

    assert response_data["message"] == "Job not found"
    assert response_data["status"] == "UNKNOWN"
    assert response_data["job_id"] == random_uuid

    job_data = response_data["job_data"]
    assert job_data["stocks_predictions"] == -2147483648
    assert job_data["amount_bought"] == -2147483648
    assert job_data["company_symbol"] == "UNKNOWN"

    job_times = job_data["times"]
    assert job_times["prediction_starting_time"] == "1970-01-01T00:00:00Z"
    assert job_times["run_at"] == "1970-01-01T00:00:00Z"
    assert job_times["prediction_future_time"] == "1970-01-01T00:00:00Z"
    assert job_times["delta_time_seconds"] == 0

    assert job_data["price_history"] == ["1970-01-01T00:00:00Z", -2147483648]


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

    assert response_data["message"] == "Job found"
    assert response_data["status"] == "SUCCESS"
    assert response_data["job_id"] == test_data["jobId"]

    job_data = response_data["job_data"]
    assert job_data["stocks_predictions"] not in (0, -2147483648)
    assert isinstance(job_data["stocks_predictions"], float)
    assert job_data["amount_bought"] == job_data["amountValidated"]
    assert isinstance(job_data["amount_bought"], int)
    assert job_data["company_symbol"] == test_data["symbol"]

    job_times = job_data["times"]
    assert job_times["prediction_starting_time"] == test_data["startingDate"]
    assert job_times["run_at"] == "1970-01-01T00:00:00Z"
    assert job_times["prediction_future_time"] == "1970-01-01T00:00:00Z"
    assert job_times["delta_time_seconds"] == 0

    assert job_data["price_history"] == ["1970-01-01T00:00:00Z", 0]


@pytest.mark.asyncio
async def test_get_heartbeat():
    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.get("/heartbeat")
    assert response.status_code == 200
    assert response.json() == {
        "message": True
    }