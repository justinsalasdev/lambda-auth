const utils = require("../utils");
const bcrypt = require("bcryptjs");
const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1"
});

const TABLE_NAME = "test-users"; //name of table created at AWS
const PRI_KEY = "username";

const dynamodb = new AWS.Dynamod.DocumentClient();

async function register(userInfo) {
  const { name, email, username, password } = userInfo;

  if (!name || !email || !username || !password) {
    return utils.buildResponse(401, { message: "All fields are required" });
  }

  //TODO: define getUser
  const foundUser = await getUser(username.toLowerCase().trim());
  if (foundUser && foundUser.username) {
    return utils.buildResponse(401, {
      message: "username already exists"
    });
  }

  const encryptedPassword = bcrypt.hashSync(password.trim(), 10);
  const user = {
    name,
    email,
    username: username.toLowerCase().trim(),
    password: encryptedPassword
  };

  //TODO: make saveUser fn
  const saveUserResponse = await saveUser(user);
  if (!saveUserResponse) {
    return utils.buildResponse(503, "Server Error. Please try again later");
  }

  //if everything is successful, return username to user
  return utils.buildResponse(200, { username });
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

modules.exports.register = register;
