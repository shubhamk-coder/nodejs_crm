import { config } from "dotenv";
config();
const jwtSecret = process.env.JWT_SECRET;

// middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Authentication failed" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default authenticateJWT;
