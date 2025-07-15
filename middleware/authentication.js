const { validatetoken } = require("../service/authentication");

function checkforauthenticationcookie(cookiename) {
  return (req, res, next) => {
    const tokencookievalue = req.cookies[cookiename];
    if (!tokencookievalue) {
      return next();  //in middleware always do retun because we dont want to pass below execution 
    }
    try {
      const userpayload = validatetoken(tokencookievalue);
      req.user = userpayload;
    } catch (error) {}
    return next();
  };
}
module.exports = {
  checkforauthenticationcookie,
};