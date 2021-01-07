import json
from decimal import Decimal
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.Session().resource("dynamodb", region_name="ap-northeast-1")
table = dynamodb.Table('netflix-movie')


def update_movie_total_ratings(movie_id, rating):
    total_ratings = 0

    try:
        response = table.query(KeyConditionExpression=Key('movie_id').eq(movie_id),
                               Limit=1)
        movie = response['Items'][0]
        total_ratings = movie["total_ratings"]
    except (KeyError, IndexError):
        print(f"Create new item for movie id {movie_id}.")
    else:
        print(f"Update total ratings for movie id {movie_id}.")
        table.delete_item(
            Key={
                'movie_id': movie_id,
                'total_ratings': total_ratings
            }
        )
    finally:
        total_ratings += rating
        response = table.put_item(
            Item={
                'movie_id': movie_id,
                'total_ratings': total_ratings,
                'status': 'ok'
            }
        )

    return response


def get_top_k_movies(k):
    response = table.query(KeyConditionExpression=Key('status').eq('ok'),
                           IndexName='status-total_ratings-index',
                           ScanIndexForward=False,
                           Limit=k)

    for movie in response["Items"]:
        movie["total_ratings"] = int(movie["total_ratings"])

    print(response["Items"])


def lambda_handler(event, context):
    movies = json.loads(event["body"])
    print(movies)

    for movie in movies:
        movie_id = movie[0] % 6
        update_movie_total_ratings(f"{movie_id}", Decimal(movie[1]))

    return {
        'statusCode': 200,
        'body': json.dumps("Success")
    }
