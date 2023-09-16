ARG NODE_VERSION=16.13.1
ARG API_PORT=8000

FROM node:${NODE_VERSION} as development

ENV API_PORT=${API_PORT}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

EXPOSE ${API_PORT}

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
CMD [ "npm", "start" , "--port", "${API_PORT}" ]

