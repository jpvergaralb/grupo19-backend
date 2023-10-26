import json
import requests


def hello(event, context):
    group_name = event['queryStringParameters']['group-name']
    user_name = event['queryStringParameters']['user-name']
    user_email = event['queryStringParameters']['user-email']
    stock_symbol = event['queryStringParameters']['symbol']
    stock_quantity = event['queryStringParameters']['quantity']
    stock_price = event['queryStringParameters']['price']

    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response

    # Use this code if you don't use the http event with the LAMBDA-PROXY
    # integration
    """
    return {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "event": event
    }
    """
