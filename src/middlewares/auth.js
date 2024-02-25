import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  const jwt_token = req.headers.authorization;

  jwt.verify(jwt_token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Must be logged in" });
    }

    req.body.userId = decoded.userId;
    return next();
  });
};

export default authenticateUser;
