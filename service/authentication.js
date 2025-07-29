const jwt = require("jsonwebtoken");
const secret = "superman123";

// use in static method in user db if user data found in login 
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

// check in middleware 
function validatetoken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = {
  createtokenforuser,validatetoken
};