import time
from http import HTTPStatus

import requests
import json
import pandas as pd


AUTHORIZATION_SERVER_API = "https://netflix-movie-recommendation.auth.ap-northeast-1.amazoncognito.com/oauth2/token?grant_type=client_credentials&scope=netflix-movie-recommendation/movie.write"
SPARK_STREAMING_API = "https://p3qczh9yei.execute-api.ap-northeast-1.amazonaws.com/dev"
STREAMING_DURATION = 10
STREAMING_CHUNK_SIZE = 10 ** 2  # number of rows


def get_access_token():
    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    with open("cognito-auth.json") as f:
        auth = json.load(f)

    res = requests.post(AUTHORIZATION_SERVER_API, auth=(auth["user"], auth["password"]), headers=headers)
    try:
        return res.json().get("access_token")
    except Exception as e:
        print(e)


def stream_data_to_spark(records):
    access_token = get_access_token()

    headers = {"Content-Type": "application/json", "Authorization": "Bearer {}".format(access_token)}
    res = requests.post(SPARK_STREAMING_API, headers=headers, json=records)

    if res.status_code == HTTPStatus.OK:
        print(f"{records} have been streamed to spark.")
    else:
        print(f"Error happened when streaming {records} to spark. HTTP status code: {res.status_code}.")


def load_records(chunk):
    transformed = chunk.to_json(orient="records")
    return json.loads(transformed)


def main():
    for chunk in pd.read_csv("movie-ratings.csv", chunksize=STREAMING_CHUNK_SIZE):
        stream_data_to_spark(load_records(chunk))

        time.sleep(STREAMING_DURATION)


if __name__ == '__main__':
    main()
