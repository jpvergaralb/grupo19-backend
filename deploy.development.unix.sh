#!/bin/bash

NO_DAEMON=false
DOCKER_COMPOSE_FILE="./docker-compose.development.yaml"

while [ $# -gt 0 ]; do
  case $1 in
    --no-daemon)
      NO_DAEMON=true
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
docker compose -f ${DOCKER_COMPOSE_FILE} build --no-cache

echo "Descargando imágenes pre-hechas de internet"
sleep 1
docker compose -f ${DOCKER_COMPOSE_FILE} pull

if ($NO_DAEMON); then
  echo "Levantando contenedores en primer plano"
  docker compose -f ${DOCKER_COMPOSE_FILE} up

else
  echo "Levantando contenedores en segundo plano"
  docker compose -f ${DOCKER_COMPOSE_FILE} up -d
fi

exit 0

