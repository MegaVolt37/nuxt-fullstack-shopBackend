const jwt = require('jsonwebtoken');
const checkAuth = (request, response, next) => {
  const token = (request.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret")
      request.userId = decoded._id
      next();
    } catch (error) {
      return response.status(403).send({
        message: "Отказано в доступе"
      })
    }
  } else {
    return response.status(403).send({
      message: "Отказано в доступе"
    })
  }
}

module.exports = checkAuth;