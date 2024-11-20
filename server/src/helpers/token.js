import jwt from "jsonwebtoken";

const generateVerifyToken = (userPayload) => {
  const token = jwt.sign(userPayload, process.env.JWT_VERIFY_SECRET, {
    expiresIn: "5m",
  });
  return token;
};

const generateAccessToken = (userPayload) => {
  const token = jwt.sign(userPayload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

export { generateVerifyToken };
