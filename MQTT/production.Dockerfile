ARG NODE_VERSION=16.13.1
ARG MQTT_API_PORT=8001

FROM node:${NODE_VERSION}

ENV MQTT_API_PORT=${MQTT_API_PORT}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${MQTT_API_PORT}

CMD [ "npm", "start" , "--port", "${MQTT_API_PORT}" ]

