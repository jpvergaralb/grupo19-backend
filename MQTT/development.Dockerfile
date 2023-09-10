FROM node:16.13.1

ARG MQTT_PORT=8001
ENV MQTT_PORT=${MQTT_PORT}

WORKDIR /usr/src/app

EXPOSE ${MQTT_PORT}

CMD [ "npm", "run", "dev", "--port", "${MQTT_PORT}" ]

