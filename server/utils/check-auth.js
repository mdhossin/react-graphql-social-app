const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
const { JWT_SECRET } = process.env;

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  //   console.log(authHeader);

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    console.log(token);

    if (token) {
      try {
        const user = jwt.verify(token, JWT_SECRET);

        return user;
      } catch (error) {
        throw new AuthenticationError("Invalid/Expires token");
      }
    } else {
      throw new Error("Authentication token must be 'bearer [token]");
    }
  } else {
    throw new Error("Authorization header must be provided");
  }
};
