#!/bin/bash
python3 -m celery --app tasks worker --loglevel=INFO
echo "Hello Celery"
