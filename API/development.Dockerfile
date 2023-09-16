ARG NODE_VERSION=16
ARG API_PORT=8000

FROM node:${NODE_VERSION} as development

ENV API_PORT=${API_PORT}

WORKDIR /usr/src/app

COPY ./entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

EXPOSE ${API_PORT}

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

CMD [ "npm", "run", "dev", "--port", "${API_PORT}" ]

