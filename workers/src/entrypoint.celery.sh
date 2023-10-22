#!/bin/bash
echo "Hello Celery"
python3 -m celery --app tasks worker --loglevel=DEBUG -c 2
echo "Bye Celery"
