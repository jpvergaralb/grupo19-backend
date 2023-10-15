from fastapi import FastAPI

from environment import env
from logs import logger as log
from logs import print

import uvicorn


app = FastAPI()


# Tests
@app.get("/")
async def root() -> dict:
    return {
        "code": 200,
        "message": "I am gRoot"
    }

# ---------------------


@app.get("/job/{job_id}")
async def placeholder_func_1(job_id: str) -> None:
    pass


@app.post("/job")
async def placeholder_func_2() -> None:
    pass


@app.get("/heartbeat")
async def heartbeat() -> dict:
    return {
        "message": True
    }

if __name__ == '__main__':
    log.info("Starting worker API")
    uvicorn.run(app, host=env["WORKER_API_HOST"], port=env["WORKER_API_PORT"])
