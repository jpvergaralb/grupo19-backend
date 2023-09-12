ARG NODE_VERSION=16
ARG API_PORT=8000

FROM node:${NODE_VERSION} as development

ENV API_PORT=${API_PORT}

WORKDIR /usr/src/app

EXPOSE ${API_PORT}

CMD [ "npm", "run", "dev", "--port", "${API_PORT}" ]

