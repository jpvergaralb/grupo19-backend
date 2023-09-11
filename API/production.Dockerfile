ARG NODE_VERSION=16.13.1
ARG API_PORT=8000

FROM node:${NODE_VERSION} as development

ENV LOCAL_PORT=${API_PORT}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${API_PORT}

CMD [ "npm", "start" , "--port", "${LOCAL_PORT}" ]

