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
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "code": 200,
        "message": "I am Root"
    }


@pytest.mark.asyncio
async def test_get_add_empty():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/add")
    assert response.status_code == 200
    assert response.json() == {
        "code": 200,
        "message": "I should add something"
    }


@pytest.mark.asyncio
async def test_get_add_values():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/add?val1=12&val2=15")
    assert response.status_code == 200
    assert response.json() == {
        "code": 200,
        "message": "I am adding 12 and 15",
        "result": 27
    }

# ----------------------------------------

@pytest.mark.asyncio
async def test_get_heartbeat():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/heartbeat")
    assert response.status_code == 200
    assert response.json() == {
        "message": True
    }

