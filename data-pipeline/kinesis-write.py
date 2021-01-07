import boto3
from datetime import datetime
import calendar
import random
import time
import json

# The kinesis stream I defined in asw console
stream_name = 'netflix-movie'

k_client = boto3.client('kinesis', region_name='ap-northeast-1')


def main():
    # create 10 data records and write them to the streams
    # Data records consist of a random number between 0 and 100,
    # A timestamp and a string consisting of the text 'testString'
    # concatenated with the random number that we generated
    # NB We don't use the event or context parameters as this lambda is not running
    # in response to an event
    #
    while True:
        property_value = random.randint(0, 2)
        property_timestamp = calendar.timegm(datetime.utcnow().timetuple())
        the_data = 'testString' + str(property_value)

        # write the data to the stream
        put_to_stream(the_data, property_value, property_timestamp)

        # wait for 1 second
        time.sleep(1)


def put_to_stream(the_data, property_value, property_timestamp):
    payload = {
        'prop': str(property_value),
        'timestamp': str(property_timestamp),
        'the_data': the_data
    }

    print(payload)

    put_response = k_client.put_record(
        StreamName=stream_name,
        Data=json.dumps(payload),
        PartitionKey=the_data)

    print(put_response)


if __name__ == '__main__':
    main()
    # import requests
    #
    # headers = {"Content-Type": "application/json"}
    # record = ("hello", 1)
    # res = requests.post("https://bu461jp3ud.execute-api.ap-northeast-1.amazonaws.com/dev", headers=headers,
    #                     json=json.dumps(record))
    # print(json.loads(res.json()))
