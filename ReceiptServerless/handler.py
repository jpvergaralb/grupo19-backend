import os
import json
from boleta_pdf_con_S3 import crear_boleta
import boto3

s3 = boto3.client('s3')


def create_receipt(event, context):
    bucket_name = os.getenv("BUCKET_NAME")
    bucket_key = os.getenv("BUCKET_KEY")

    # transaction_id = event['queryStringParameters']['transaction-id']
    # group_name = event['queryStringParameters']['group-name']
    # user_name = event['queryStringParameters']['user-name']
    # user_email = event['queryStringParameters']['user-email']
    # stock_symbol = event['queryStringParameters']['symbol']
    # stock_quantity = event['queryStringParameters']['quantity']
    # stock_price = event['queryStringParameters']['price']
    request_body = event['body']
    transaction_id = request_body['transaction-id']
    group_name = request_body['group-name']
    user_name = request_body['user-name']
    user_email = request_body['user-email']
    stock_symbol = request_body['symbol']
    stock_quantity = request_body['quantity']
    stock_price = request_body['price']

    boleta = crear_boleta(transaction_id, group_name, user_name, user_email, stock_symbol,
                          stock_quantity, stock_price)

    url = save_to_s3(bucket_name, bucket_key, boleta)

    body = {
        "message": "Boleta creada correctamente",
        "url": url
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response


def save_to_s3(bucket, key, pdf_name):
    s3.upload_file("/tmp/" + pdf_name, bucket, key + pdf_name)

    return f"https://{bucket}.s3.amazonaws.com/{key}{pdf_name}"

# {
#     "body": {
#     "transaction-id": "12asd",
#     "group-name": 19,
#     "user-name": "rocio",
#     "user-email": "roc@q.si",
#     "symbol": "APPL",
#     "quantity": 200,
#     "price": 1000
#     }
# }