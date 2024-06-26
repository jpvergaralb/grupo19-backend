ARG NODE_VERSION=16.13.1

FROM node:${NODE_VERSION}

ARG MQTT_API_PORT=8001
ENV MQTT_API_PORT=${MQTT_API_PORT}

WORKDIR /usr/src/app

EXPOSE ${MQTT_API_PORT}

ENTRYPOINT ["/usr/src/app/entrypoint.development.sh"]

