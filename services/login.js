const utils = require("../utils");
const bcrypt = require("bcryptjs");
const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1"
});

const TABLE_NAME = "test-users"; //name of table created at AWS
const PRI_KEY = "username";

const dynamodb = new AWS.Dynamod.DocumentClient();

async function login(user) {
  const { username, password } = user;

  if (!username || !password) {
    return utils.buildResponse(401, {
      message: "username and password are required"
    });
  }

  const foundUser = await getUser(username);

  if (!foundUser || !foundUser.username) {
    return utils.buildResponse(403, { message: "user does not exists" });
  }

  if (!bcrypt.compareSync(password, foundUser.password)) {
    return utils.buildResponse(403, { message: "password is incorrect" });
  }

  const userInfo = {
    username: foundUser.username,
    email: foundUser.email
  };

  const token = utils.generateToken(userInfo);

  return utils.buildResponse(200, { token, userInfo });

  //payload
}

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

module.exports.login = login;
