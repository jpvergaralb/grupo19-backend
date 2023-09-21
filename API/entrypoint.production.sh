#!/bin/bash

npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

npm start --port "${API_PORT}"
