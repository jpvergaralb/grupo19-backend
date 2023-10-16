from logs import logger as log
from logs import print
from environment import env

import pytest
from httpx import AsyncClient
import asyncio

from app import app


@pytest.mark.asyncio
async def test_root():
    print("Starting test_root...")

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")

    print("Checking status code...")
    assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"

    print("Checking response content...")
    expected_content = {
        "code": 200,
        "message": "I am Root"
    }
    assert response.json() == expected_content, f"Expected content {expected_content}, but got {response.json()}"




if __name__ == '__main__':
    asyncio.run(test_root())
    log.info("All tests passed!")