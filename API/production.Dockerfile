ARG NODE_VERSION=16.13.1
ARG LOCAL_PORT=8000
ENV LOCAL_PORT=${LOCAL_PORT}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${LOCAL_PORT}

CMD [ "npm", "start" , "--port", "${LOCAL_PORT}" ]

