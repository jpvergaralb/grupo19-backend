from logs import logging, logger as log, print, runtime
from time import time, sleep

# Actualización de `start_time` para este script
start_time = time()
import asyncio
import pytest


@pytest.mark.asyncio
async def test_log_output(caplog):
    with caplog.at_level(logging.DEBUG):
        log.debug("Debug message")
        log.info("Info message")
        log.warning("Warning message")
        log.error("Error message")
        log.critical("Critical message")

        assert "Debug message" in caplog.text
        assert "Info message" in caplog.text
        assert "Warning message" in caplog.text
        assert "Error message" in caplog.text
        assert "Critical message" in caplog.text
