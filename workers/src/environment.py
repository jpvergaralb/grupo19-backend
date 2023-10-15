"""Archivo con variables de entorno"""
import dotenv
import os
import sys

from utils import convert_str_to_typed

# ------------------------------------

env: dict

# ------------------------------------

# alias
getenv = os.environ.get


if os.path.isfile('.env'):
    # Cargo variables de entorno.
    print("Cargando variables de entorno...")
    dotenv.load_dotenv(".env")
else:
    print("Archivo .env no encontrado.\n"
          "Usando variables preexistentes.")

env = {
    "SAMPLE_VARIABLE": getenv("SAMPLE_VARIABLE"),
}

# Error catching
for env_var in env.keys():
    if str(env[env_var]) in ("None", "none", "", None):
        print(f"Variable {env_var} no definida.")
        print(f"Saliendo con exit code 1")
        sys.exit(1)

# Convertir a tipos de variable correspondiente

for env_var in env.keys():
    env[env_var] = convert_str_to_typed(env[env_var])
