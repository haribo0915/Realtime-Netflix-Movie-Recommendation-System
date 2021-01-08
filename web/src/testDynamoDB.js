const AWS = require("aws-sdk");

AWS.config.update({
    region: "ap-northeast-1",
});

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "netflix-movie";

const params = {
    TableName: tableName, 
    KeyConditionExpression: "#stage = :fine",
    ExpressionAttributeNames: {
        "#stage": "status",
    },
    ExpressionAttributeValues: {
        ":fine": "ok",
    }, 
    IndexName: 'status-total_ratings-index',
    ScanIndexForward: false,
    Limit: 6, 
}

docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        //console.log("GetItem succeeded:", data.Items[0]);
    }
});

/*const params = {
    TableName: tableName,
};

docClient.scan(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
    }
});*/