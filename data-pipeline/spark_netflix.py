import sys

from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kinesis import KinesisUtils, InitialPositionInStream
import json
import requests


# /bin/spark-submit --packages "com.amazonaws:aws-java-sdk-core:1.11.930,org.apache.spark:spark-streaming-kinesis-asl_2.11:2.4.0" spark-netflix.py spark-netflix netflix-movie https://kinesis.ap-northeast-1.amazonaws.com ap-northeast-1

DYNAMODB_API = "https://bu461jp3ud.execute-api.ap-northeast-1.amazonaws.com/dev"


def parse_record(record):
    parsed_record = json.loads(record)
    return parsed_record["movieId"], parsed_record["rating"]


def sendPartition(iter_):
    headers = {"Content-Type": "application/json"}
    records = [record for record in iter_]

    # Don't ddos api if no records
    if records:
        requests.post(DYNAMODB_API, headers=headers, json=records)


def printRecord(rdd):
    print(rdd.collect())


if __name__ == '__main__':
    if len(sys.argv) != 5:
        print(
            "Usage: spark-netflix.py <app-name> <stream-name> <endpoint-url> <region-name>",
            file=sys.stderr)
        sys.exit(-1)

    BATCH_DURATION_IN_SECS = 5

    sc = SparkContext(appName="netflix-movie-realtime-streaming")
    ssc = StreamingContext(sc, BATCH_DURATION_IN_SECS)
    appName, streamName, endpointUrl, regionName = sys.argv[1:]
    kinesis_stream = KinesisUtils.createStream(ssc,
                                               appName,
                                               streamName,
                                               endpointUrl,
                                               regionName,
                                               InitialPositionInStream.LATEST,
                                               1)

    kinesis_stream.map(parse_record) \
        .reduceByKey(lambda a, b: a + b) \
        .foreachRDD(lambda rdd: rdd.foreachPartition(sendPartition))

    ssc.start()
    ssc.awaitTermination()
