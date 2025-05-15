const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied" });
  }

  const token = authHeader.split(" ")[1]; // Get only the token part

  try {
    const verified = jwt.verify(token, jwtSecret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
