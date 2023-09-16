#!/bin/bash

# Crear la base de datos
npx sequelize-cli db:create

# Ejecuta las migraciones
npx sequelize-cli db:migrate

# Ejecuta los seeders
npx sequelize-cli db:seed:all

# Ejecuta el comando que recibas (como iniciar tu aplicación)
exec "$@"
