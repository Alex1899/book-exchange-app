const express_jwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const csrf = require("csurf");

module.exports.csrfProtection = csrf({
  cookie: true,
});

module.exports.checkjwt = express_jwt({
  secret: process.env.JWT_TOKEN,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.jwt,
});

module.exports.createToken = (options) => {
  return jwt.sign(
    { ...options, iss: "api.book-exchange", aud: "api.book-exchange" },
    process.env.JWT_TOKEN,
    {
      expiresIn: "1h",
      algorithm: "HS256",
    }
  );
};

module.exports.attachUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.status(401).send({ errors: { msg: "Not authorized" } });
    return;
  }
  const decodedToken = jwtDecode(token);
  if (!decodedToken) {
    res.status(500).send({ errors: { msg: "Error decoding token" } });
    return;
  }

  req.user = decodedToken;
  next();
};

// handle errors
module.exports.handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "", fullname: "", username: "" };

  // duplicate error code
  if (err.code === 11000) {
    Object.keys(err.keyValue).forEach((key) => {
      let message;
      if (key === "email") {
        message = "User with this email already exists";
      }

      if (key === "username") {
        message = "User with this username already exists";
      }

      errors[key] = message;
    });
  }

  // validation errros
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.message.includes("duplicate key error")) {
  }

  return errors;
};
