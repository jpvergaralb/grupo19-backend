# Documentación de serverless

1. Se crean los archivos necesarios y se instalan las librerias en una carpeta accesible
2. Se guarda un zip de las librerías utilizadas y se sube a una capa personalizada.
3. Se crea una nueva función lambda. O se utiliza una preexistente.
4. Se asigna la capa personalizada a la función lambda.
5. Se guarda un zip de los archivos de la función utilizados y se sube al código de la función lambda.
6. Se actualizan las variables de entorno de la función lambda en:  Configuración > Variables de entorno.
7. Se actualizan las variables de entorno de la función lambda en:  Configuración > Variables de entorno.
8. FIN :)

En caso de querer reemplazar la función lambda, se tendrán que actualizar las variables de entorno:
- PDF_LAMBDA_FUNCTION: Nombre de la función lambda
- BUCKET_REGION: Región en la que se ubica la función lambda
- AWS_ACCESS_KEY_S3: Llave de acceso a la cuenta
- AWS_SECRET_ACCESS_KEY_S3: Llave secreta de acceso a la cuenta
