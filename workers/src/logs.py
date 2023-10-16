import logging
import coloredlogs
from time import time, sleep
# --------------------------
start_time = time()


def runtime():
    """
    --- Documentación por ChatGPT ---
    Calcula el tiempo transcurrido desde un tiempo de inicio `start_time`.

    Notas
    -----
    Esta función calcula el tiempo que ha transcurrido desde `start_time`
    (que debe ser definido previamente) hasta el momento actual. El tiempo
    transcurrido se devuelve en el formato 'HH:MM:SS'.

    Es importante notar que `start_time` debe ser definido previamente y
    representar un punto de tiempo anterior (usualmente usando
    `time.time()`).
    La función no verifica la existencia de `start_time`, por lo que debe
    asegurarse de que esté correctamente definido antes de llamar a esta
    función.

    Retorna
    -------
    str
        El tiempo transcurrido en formato 'HH:MM:SS'.

    Ejemplo
    -------
    >>> start_time = time.time()
    >>> # Suponiendo que esperas por algunos segundos o minutos...
    >>> elapsed = runtime()
    >>> print(f"Tiempo transcurrido: {elapsed}")
    Tiempo transcurrido: 00:00:15  # Solo un ejemplo.
    """
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

# Redefinir "print" como "log.debug".
print = logger.debug

if __name__ == '__main__':
    logger.debug("Hello World!")
    logger.info("Hello World!")
    logger.warning("Hello World!")
    logger.error("Hello World!")
    logger.critical("Hello World!")
