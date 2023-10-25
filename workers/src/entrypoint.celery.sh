#!/bin/bash
sleep 3
echo "Hello Celery"
python3 -m celery --app tasks worker --loglevel=INFO -c 4
echo "Bye Celery"
