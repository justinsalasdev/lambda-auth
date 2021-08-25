const utils = require("../utils");

function verify(requestBody) {
  if (!requestBody?.user?.username || !requestBody.token) {
    return utils.buildResponse(401, {
      verified: false,
      message: "incorrect request body"
    });
  }

  const user = requestBody.user;
  const token = requestBody.token;
  const verification = utils.verifyToken(user.username, token);

  if (!verification.verified) {
    return utils.buildResponse(401, verification);
  }

  return utils.buildResponse(200, {
    verified: true,
    message: "success",
    user,
    token
  });
}

module.exports.verify = verify;
