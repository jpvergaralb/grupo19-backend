ARG NODE_VERSION=16
ARG LOCAL_PORT=8000

FROM node:${NODE_VERSION} as development

ENV LOCAL_PORT=${API_PORT}

WORKDIR /usr/src/app

EXPOSE ${API_PORT}

CMD [ "npm", "run", "dev", "--port", "${LOCAL_PORT}" ]

