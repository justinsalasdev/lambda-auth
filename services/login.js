const utils = require("../utils");
const db = require("../db/db");
const bcrypt = require("bcryptjs");

async function login(user) {
  const { username, password } = user;

  if (!username || !password) {
    return utils.buildResponse(401, {
      message: "username and password are required"
    });
  }

  const foundUser = await db.getUser(username);

  if (!foundUser?.username) {
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

module.exports.login = login;
