#!/bin/bash
echo "Hello API"
python3 -m uvicorn app:app --host 0.0.0.0 --reload --port 8001
echo "Bye API"