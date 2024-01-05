import logger from "../config/loggerConfig.js";
import authService from "../services/auth.service.js";

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, error: "Access denied" });
    }
    const decoded = authService.verify(token);
    if (decoded.iss !== "authService") {
    }
    if (decoded.aud !== "LetsSplitApp") {
      return res
        .status(401)
        .json({ success: false, error: "Invalid audience." });
    }

    req.userData = decoded;
    next();
  } catch (error) {
    logger.error(`authenticateToken error: ${error}`);

    res.status(401).json({
      success: false,
      error: "Authentication Failed",
    });
  }
  next();
};

const isAuth = async (req, res, next) => {
  if (!req.session.isAuth) {
    return res.status(401).json({ success: false, error: "unauthorised" });
  }
  next();
};

export default { authenticateToken, isAuth };
