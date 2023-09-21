#!/bin/bash

NO_DAEMON=false
DOCKER_COMPOSE_FILE="./docker-compose.development.yaml"

while [ $# -gt 0 ]; do
  case $1 in
    --no-daemon)
      NO_DAEMON=true
      exit 0
      ;;
    *)
      echo "Invalid option: $1" >&2
      exit 1
      ;;
  esac
  shift
done


echo "Construyendo imágenes (sin caché)"
sleep 1
docker compose build --no-cache -f ${DOCKER_COMPOSE_FILE}

echo "Descargando imágenes pre-hechas de internet"
sleep 1
docker compose pull -f ${DOCKER_COMPOSE_FILE}

if ($NO_DAEMON); then
  echo "Levantando contenedores en primer plano"
  docker compose up -f ${DOCKER_COMPOSE_FILE}

else
  echo "Levantando contenedores en segundo plano"
  docker compose up -f ${DOCKER_COMPOSE_FILE} -d
fi

