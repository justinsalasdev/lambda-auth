const utils = require("../utils");
const db = require("../db/db");
const bcrypt = require("bcryptjs");

async function register(userInfo) {
  const { name, email, username, password } = userInfo;

  if (!name || !email || !username || !password) {
    return utils.buildResponse(401, { message: "All fields are required" });
  }

  //TODO: define getUser
  const foundUser = await db.getUser(username.toLowerCase().trim());
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

  const saveUserResponse = await db.saveUser(user);
  if (!saveUserResponse) {
    return utils.buildResponse(503, "Server Error. Please try again later");
  }

  //if everything is successful, return username to user
  return utils.buildResponse(200, { username });
}

module.exports.register = register;
