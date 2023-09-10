FROM node:16.13.1

ARG MQTT_PORT=8001
ENV MQTT_PORT=${MQTT_PORT}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${MQTT_PORT}

CMD [ "npm", "start" , "--port", "${MQTT_PORT}" ]

