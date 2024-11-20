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

export { ensureIsAuthenticated };
