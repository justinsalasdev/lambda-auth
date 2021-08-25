const jwt = require("jsonwebtoken");

function generateToken(userInfo) {
  if (!userInfo) {
    return null;
  }
  return jwt.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
}

function verifyToken(username, token) {
  return jwt.verify(token, process.env.JWT_SECRET, (err, res) => {
    if (err) {
      return {
        verified: false,
        message: "invalid token"
      };
    }

    if (res.username !== username) {
      return {
        verified: false,
        message: "invalid user"
      };
    }

    return {
      verified: true,
      message: "verified"
    };
  });
}

function buildResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

module.exports.buildResponse = buildResponse;
module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;
