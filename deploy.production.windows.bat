@echo off
setlocal EnableDelayedExpansion

set NO_DAEMON=false
set DOCKER_COMPOSE_FILE="./docker-compose.production.yaml"

:loop
if "%~1"=="" goto endloop
if "%~1"=="--no-daemon" (
    set NO_DAEMON=true
    goto :eof
)
echo Invalid option: %1
exit /b 1
shift
goto loop
:endloop

echo Construyendo imágenes (sin caché)
timeout /t 1
docker compose build --no-cache -f %DOCKER_COMPOSE_FILE%

echo Descargando imágenes pre-hechas de internet
timeout /t 1
docker compose pull -f %DOCKER_COMPOSE_FILE%

if "%NO_DAEMON%"=="true" (
    echo Levantando contenedores en primer plano
    docker compose up -f %DOCKER_COMPOSE_FILE%
) else (
    echo Levantando contenedores en segundo plano
    docker compose up -f %DOCKER_COMPOSE_FILE% -d
)
