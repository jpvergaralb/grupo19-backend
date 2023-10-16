#!/bin/bash
python3 -m uvicorn app:app --host 0.0.0.0 --reload --port 8001
echo "Hello API"