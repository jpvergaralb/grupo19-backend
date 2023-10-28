import os
import json
from boleta_pdf_con_S3 import crear_boleta
import boto3
import dotenv

dotenv.load_dotenv()
s3 = boto3.client('s3')


def create_receipt(event, context):
    bucket_name = os.getenv("BUCKET_NAME")
    bucket_key = os.getenv("BUCKET_KEY")

    transaction_id = event['queryStringParameters']['transaction-id']
    group_name = event['queryStringParameters']['group-name']
    user_name = event['queryStringParameters']['user-name']
    user_email = event['queryStringParameters']['user-email']
    stock_symbol = event['queryStringParameters']['symbol']
    stock_quantity = event['queryStringParameters']['quantity']
    stock_price = event['queryStringParameters']['price']

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
