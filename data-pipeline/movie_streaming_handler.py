import boto3
import json

stream_name = 'netflix-movie'
kinesis = boto3.client('kinesis', region_name='ap-northeast-1')


def lambda_handler(event, context):
    records = json.loads(event["body"])
    kinesis_records = []
    counter = 0
    max_num_of_kinesis_records = 400  # Max number of records put to kinesis at once

    for record in records:
        kinesis_records.append({
            "Data": json.dumps(record),
            "PartitionKey": "movie_id"
        })
        counter += 1

        if counter >= max_num_of_kinesis_records:
            kinesis.put_records(Records=kinesis_records,
                                StreamName=stream_name)
            print(f"Exceed max num of records: {counter}, start pushing records to kinesis ...")
            kinesis_records = []
            counter = 0

    kinesis.put_records(Records=kinesis_records,
                        StreamName=stream_name)

    return {
        'statusCode': 200,
        'body': json.dumps("Success")
    }
