const jwt = require('jsonwebtoken');

function generateToken(params) {
  return jwt.sign({ id: params }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: '10h'
  });
}

module.exports = { generateToken };