FROM python:3.11-bookworm

RUN pip3 install --upgrade pip

RUN mkdir -v /app
WORKDIR /app

COPY requirements.txt /app/
RUN pip3 install -r requirements.txt

COPY src/ /app/

RUN ls -la

EXPOSE 8001
#RUN chmod a+x ./entrypoint.api.sh
#RUN chmod a+x ./entrypoint.celery.sh
#RUN chmod a+x ./entrypoint.pytest.sh
RUN chmod -R a+x ./
