ARG NODE_VERSION=16.13.1
ARG API_PORT=8000

FROM node:${NODE_VERSION} as development

ENV API_PORT=${API_PORT}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN mv -v ./entrypoint.production.sh ./entrypoint.sh && \
    rm -v /usr/src/app/entrypoint.development.sh && \
    zchmod +x /usr/src/app/entrypoint.sh

EXPOSE ${API_PORT}

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

