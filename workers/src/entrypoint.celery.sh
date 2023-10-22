#!/bin/bash
echo "Hello Celery"
python3 -m celery --app tasks worker --loglevel=debug -c 2
echo "Bye Celery"
