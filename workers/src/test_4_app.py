from logs import logger as log
from logs import print
from environment import env
from time import sleep
import pytest
from httpx import AsyncClient
import asyncio

from app import app


@pytest.mark.asyncio
async def test_get_root():
    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "I am Root"
    }


@pytest.mark.asyncio
async def test_get_add_empty():
    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.get("/add")
    assert response.status_code == 204
    assert response.json() == {
        "message": "I should add something"
    }


@pytest.mark.asyncio
async def test_get_add_values():
    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.get("/add?val1=12&val2=15")
    assert response.status_code == 200
    assert response.json() == {
        "message": "I am adding 12 and 15",
        "result": 27
    }


@pytest.mark.asyncio
async def test_get_subtract_values():
    test_data = {
        "val1": {"number": 12},
        "val2": {"number": 15}
    }

    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.post("/subtract", json=test_data)

    assert response.status_code == 200
    assert response.json() == {
        "message": "I am subtracting 15 from 12",
        "result": -3  # 12 - 15 = -3
    }


@pytest.mark.asyncio
async def test_get_heartbeat():
    async with AsyncClient(app=app, base_url="http://test") as async_client:
        response = await async_client.get("/heartbeat")
    assert response.status_code == 200
    assert response.json() == {
        "message": True
    }

