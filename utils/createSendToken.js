const jwt = require("jsonwebtoken");

async function createSendToken(statusCode, user, res) {
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_MAXAGE,
  });

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  });

  user.password = undefined;

  return res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
}

module.exports = createSendToken;
