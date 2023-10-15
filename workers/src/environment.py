"""Archivo con variables de entorno"""
import dotenv
import os
import sys

from logs import logger as log, logging, print
from utils import convert_str_to_typed

# ------------------------------------

env: dict

# ------------------------------------

# alias
getenv = os.environ.get

for path in ('.', '..', '../..', '../..'):
    located = False

    for prefix in ('', 'example', 'template'):
        file_path = f'{path}/{prefix}.env'

        if os.path.isfile(file_path):
            # Cargo variables de entorno.
            log.info(f"Cargando variables de entorno de '{file_path}'...")
            dotenv.load_dotenv(file_path)
            located = True
            break

    if located:
        break

if not located:
    log.warning("Archivo .env no encontrado.\n"
                "\t\t\t\tUsando variables preexistentes.")

env = {
    "LOG_LEVEL": getenv("LOG_LEVEL"),
}

log_level = env["LOG_LEVEL"].upper()

match log_level:
    case _ if log_level in ("TRACE", "VERBOSE", "DEBUG"):
        log.setLevel(logging.DEBUG)

    case _ if log_level in ("INFO", "INFORMATION"):
        log.setLevel(logging.INFO)

    case _ if log_level in ("WARN", "WARNING"):
        log.setLevel(logging.WARNING)

    case _ if log_level in ("ERR", "ERROR"):
        log.setLevel(logging.ERROR)

    case _ if log_level in ("FTL", "FATAL", "CRIT", "CRITICAL"):
        log.setLevel(logging.CRITICAL)

    case _ if log_level in ("NONE", "NULL", "NO", "QUIET", "SILENT"):
        log.setLevel(logging.CRITICAL + 1)

    case _:
        log.warning(f"Valor no reconocido para LOG_LEVEL: {env['LOG_LEVEL']}. "
                    f"Usando el nivel predeterminado INFO.")
        env["LOG_LEVEL"] = "INFO"
        log.setLevel(logging.INFO)

# Error catching
for env_var in env.keys():
    if str(env[env_var]) in ("None", "none", "", None):
        log.critical(f"Variable '{env_var}' no definida.\n"
                     f"\t\t\t\tSaliendo con exit code 1")
        sys.exit(1)

# Convertir a tipos de variable correspondiente
for env_var in env.keys():
    env[env_var] = convert_str_to_typed(env[env_var])

if __name__ == '__main__':
    print("hello_world")