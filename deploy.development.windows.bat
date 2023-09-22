@echo off
setlocal EnableDelayedExpansion

set NO_DAEMON=false
set DOCKER_COMPOSE_FILE="./docker-compose.development.yaml"

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
docker compose -f %DOCKER_COMPOSE_FILE% build --no-cache

echo Descargando imágenes pre-hechas de internet
timeout /t 1
docker compose -f %DOCKER_COMPOSE_FILE% pull

if "%NO_DAEMON%"=="true" (
    echo Levantando contenedores en primer plano
    docker compose -f %DOCKER_COMPOSE_FILE% up
) else (
    echo Levantando contenedores en segundo plano
    docker compose -f %DOCKER_COMPOSE_FILE% up -d
)
