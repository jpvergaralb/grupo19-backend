#!/bin/bash

chmod a+x ./deploy.production.unix.sh

echo "Borrando contenedores"
sleep 1

DOCKER_COMPOSE_FILE="./docker-compose.production.yaml"
docker compose -f ${DOCKER_COMPOSE_FILE} down

echo "Lanzando contenedores"
sleep 1
sh ./deploy.production.unix.sh
