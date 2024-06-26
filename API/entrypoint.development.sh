#!/bin/bash

npm install

npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

npm run dev --port "${API_PORT}"
