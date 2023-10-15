import logging
import coloredlogs
from time import time, sleep
# --------------------------
start_time = time()


def runtime():
    elapsed_time = time() - start_time
    mins, secs = divmod(elapsed_time, 60)
    hours, mins = divmod(mins, 60)
    return f"{int(hours):02}:{int(mins):02}:{int(secs):02}"


class CustomLogRecord(logging.LogRecord):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.runtime = runtime()
# --------------------------


level_styles = {
    'debug': {'color': 'white', 'bold': False},
    'info': {'color': 'cyan', 'bold': True},
    'warning': {'color': 'yellow', 'bold': True},
    'error': {'color': 'red', 'bold': True},
    'critical': {'color': 'red', 'background': 'black', 'bold': True}
}

field_styles = {
    'runtime': {'color': 'blue'},
    'levelname': {'color': 'white', 'bold': True}
}

logging.setLogRecordFactory(CustomLogRecord)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

coloredlogs.install(
    level='DEBUG', logger=logger, level_styles=level_styles,
    field_styles=field_styles,
    fmt="[%(runtime)s] [%(name)s] [%(levelname)s] - %(message)s")

if __name__ == '__main__':
    logger.debug("Hello World!")
    logger.info("Hello World!")
    logger.warning("Hello World!")
    logger.error("Hello World!")
    logger.critical("Hello World!")
