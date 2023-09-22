# grupo19-backend

## Como correr la aplicación en un ambiente local:

<ol>
  <li>Se corre el comando "npm install" en los directorios: API y MQTT.</li>
  <li>Se debe crear el archivo ".env" siguiendo el formato del archivo "template.env" donde se deberán rellenar las variables sin valores. Sin embargo, hay que considerar que las variables MQTT_BROKER_USERNAME y MQTT_BROKER_PASSWORD deben ir con los valores dados por enunciado</li>
  <li>Se corre el comando "docker-compose build" y luego "docker-compose up".</li>
  <li>Luego, el puerto para probar la API estará dado por "API_PORT" en el archivo ".env".</li>
</ol>