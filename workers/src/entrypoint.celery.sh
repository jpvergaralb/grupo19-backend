#!/bin/bash
python3 -m celery --app tasks worker --loglevel=INFO
#celery --help
echo "Hello Celery"
#celery -A tasks worker --loglevel=INFO