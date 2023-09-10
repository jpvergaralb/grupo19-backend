ARG NODE_VERSION=16
ARG LOCAL_PORT=8000

FROM node:${NODE_VERSION} as development

ENV LOCAL_PORT=${LOCAL_PORT}

WORKDIR /usr/src/app

EXPOSE ${LOCAL_PORT}

CMD [ "npm", "run", "dev", "--port", "${LOCAL_PORT}" ]

