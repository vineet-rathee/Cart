const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const redis = require("../configs/redis");

async function register(req, res, next) {
  const { name, email, role, password } = req.body || {};
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "!! provide all deatils to register !!" });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email",
    });
  }

  const user = await userModel.findOne({ email });
  if (user)
    return res
      .status(409)
      .json({ message: "user already eists with given email" });

  next();
}

async function login(req, res, next) {
  const { email, password } = req.body || {};
  if (!password || !email)
    return res
      .status(400)
      .json({ message: "!! provide all deatils to login !!" });

  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "!! no user found !!" });
  const pass = await user.checkPassword(password);
  if (pass) next();
  else return res.status(401).json({ message: "!! wrong password !!" });
}

async function authenticator(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({
      valid: "false",
      message: "!! login to use this api !!",
    });
  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.name=decoded.name;
    req.email = decoded.mail;
    req.id = decoded.id;
    req.role = decoded.role;
    const redistoken = await redis.get(`token${decoded.id}`);
    if (redistoken !== token)
      return res.status(401).json({
        valid: "false",
        message: "!! Authentication failed !!",
      });
    next();
  } catch (err) {
    return res.status(401).json({
      valid: "false",
      message: "!! user is not logged in !!",
    });
  }
}

module.exports = {
  register,
  login,
  authenticator,
};
