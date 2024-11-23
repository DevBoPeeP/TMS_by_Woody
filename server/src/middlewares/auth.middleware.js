import User from "./../models/user.model.js";
const ensureIsAuthenticated = async (req, res, next) => {
  let token = null;
  const authHeader = req.headers["authorizartion"];
  if (authHeader && authHeader.startswith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({
      message: "auth token is required",
    });
  }
  try {
    const userPayLoad = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // check if user exists
    const user = await User.findById(userPayLoad._id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "unathorised request:invalid user" });
    }
    // attach user to the request obeject
    req.user = user;
    next();
  } catch (error) {
    res.status(500)({ message: error.message });
  }
};

// admin middleware
const adminMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // if user is admin, move to the next middleware/controller
    next();
    return;
  }
  // if not admin, send 403 Forbidden --> terminate the request
  res.status(403).json({ message: "Only admins can do this!" });
};

const creatorMiddleware = async (req, res, next) => {
  if (
    (req.user && req.user.role === "creator") ||
    (req.user && req.user.role === "admin")
  ) {
    // if user is creator, move to the next middleware/controller
    next();
    return;
  }
  // if not creator, send 403 Forbidden --> terminate the request
  res.status(403).json({ message: "Only creators can do this!" });
};

export { ensureIsAuthenticated, adminMiddleware, creatorMiddleware };
