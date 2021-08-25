const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1"
});

const TABLE_NAME = "test-users"; //name of table created at AWS
const PRI_KEY = "username";

const dynamodb = new AWS.Dynamod.DocumentClient();

async function getUser(username) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      [PRI_KEY]: username
    }
  };

  return await dynamodb
    .get(params)
    .promise()
    .then(
      res => res.Item,
      err => {
        console.error("Error getting user", err);
      }
    );
}

async function saveUser(user) {
  const params = {
    TableName: TABLE_NAME,
    Item: user
  };

  return await dynamodb
    .put(params)
    .promise()
    .then(
      _ => true,
      err => {
        console.error("Error saving the user ", err);
      }
    );
}

module.exports.getUser = getUser;
module.exports.saveUser = saveUser;
