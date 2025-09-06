// helper to generate JWT
const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};