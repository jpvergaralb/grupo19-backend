# Usar una imagen base de Python
FROM python:3.11

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos del proyecto al contenedor
COPY ./AlertService/requirements.txt .

# Instalar las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el script de Python al contenedor
COPY ./AlertService/alert_service.py .

# Comando para ejecutar el script cuando el contenedor inicie
CMD ["python", "-u", "./alert_service.py"]
