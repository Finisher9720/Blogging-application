const jwt = require("jsonwebtoken");
const secret = "superman123";

function createtokenforuser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileimageurl:user.profileImageURL,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function validatetoken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = {
  createtokenforuser,validatetoken
};