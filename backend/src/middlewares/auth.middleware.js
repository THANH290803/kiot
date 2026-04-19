const jwt = require("jsonwebtoken");

async function decodeBearerToken(req) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("Invalid token format");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
}

async function authMiddleware(req, res, next) {
  try {
    const decoded = await decodeBearerToken(req);
    if (!decoded) {
      return res.status(401).json({ message: "No token provided" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

async function optionalAuthMiddleware(req, res, next) {
  try {
    const decoded = await decodeBearerToken(req);
    if (decoded) {
      req.user = decoded;
    }
    next();
  } catch (err) {
    // Token sai thì coi như chưa đăng nhập, không chặn API GET public
    req.user = null;
    next();
  }
}

async function customerAuthMiddleware(req, res, next) {
  try {
    const decoded = await decodeBearerToken(req);
    if (!decoded) {
      return res.status(401).json({ message: "No token provided" });
    }

    if (decoded.type !== "customer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = authMiddleware;
module.exports.optionalAuthMiddleware = optionalAuthMiddleware;
module.exports.customerAuthMiddleware = customerAuthMiddleware;
