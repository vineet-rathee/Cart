const userModel = require("../models/user.model");
const addressModel = require("../models/address.model");
const redis = require("../configs/redis");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { name, email, password, role } = req.body || {};
  const user = await userModel.create({ name, email, password, role });

  const token = await jwt.sign(
    { id: user._id, role: user.role, mail: user.email,name:user.name },
    process.env.JWT,
  );
  res.cookie("token", token);
  await redis.set(`token${user._id}`, token,"EX",600);

  return res.status(201).json({
    message: "!! user registered successfully !!",
    user,
  });
}

async function login(req, res) {
  const { email } = req.body || {};
  const user = await userModel.findOne({ email });

  const token = await jwt.sign(
    { id: user._id, role: user.role, mail: user.email,name:user.name },
    process.env.JWT,
  );
  res.cookie("token", token);
  await redis.set(`token${user._id}`, token,"EX",600);

  return res.status(201).json({
    message: "!! user logged in successfully !!",
    user,
  });
}

async function logout(req, res) {
  const id = req.id;
  res.clearCookie("token");
  await redis.del(`token${id}`);
  res.status(200).json({ message: "!! user logged out !!" });
}

async function changePassword(req, res) {
  const { email, password, newpassword } = req.body || {};
  if (!email || !password || !newpassword)
    return res.status(400).send("!! give all data to change password !!");
  if (password === newpassword)
    return res
      .status(400)
      .send("!! new and old password should be different !!");
  const user = await userModel.findOne({ email });
  if (!user) return res.status(401).send("!! user not found !!");
  const temp = await user.checkPassword(password);
  if (temp) {
    user.password = newpassword;
    await user.save();
    res.status(200).json({ message: "!! password changed !!" });
  } else {
    res.status(401).json({ message: "!! wrong password !!" });
  }
}

async function me(req, res) {
  const user={
    email:req.email,
    name:req.name,
    id:req.id,
    role:req.role,
  };
  res.status(200).json({
    valid: "true",
    user,
  });
}

async function address(req, res) {
  const { pincode, city, state, country } = req.body || {};
  const email = req.email;
  const _id = req.id;

  if (!pincode || !city || !state || !country)
    return res.status(400).send("!! provide all detail !!");

  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).send("!! no user found !!");

  const temp = await addressModel.findOne({
    user: _id,
    pincode,
    city,
    state,
    country,
  });
  if (temp) return res.status(400).send("!! address already exists !!");

  const address = await addressModel.create({
    user: _id,
    pincode,
    city,
    state,
    country,
  });

  user.address.push(address._id);
  user.save();
  res.status(201).json({
    message: "!! address added !!",
    address,
  });
}

async function update(req, res) {
  const { name, email } = req.body || {};
  if (!name && !email) return res.status(400).send("!! no info to update !!");
  const _id = req.id;
  const user = await userModel.findOne({ _id });
  if (!user) return res.status(401).send("!! user not found log in again !!");
  if (email) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email"
        });
    }

    const temp = await userModel.findOne({ email });
    if (temp)
      return res.status(409).send("!! user already exists with given email !!");
    else {
      user.email = email;
    }
  }
  if (name) {
    user.name = name;
  }
  await user.save();

  const token = await jwt.sign(
    { id: user._id, role: user.role, mail: user.email,name:user.name },
    process.env.JWT,
  );
  res.cookie("token", token);
  await redis.set(`token${user._id}`, token,"EX",600);

  res.status(200).send("!! information updated !!");
}

async function addresses(req, res) {
  const _id = req.id;
  const user = await userModel.findOne({ _id }).populate("address");
  if (!user) return res.status(404).send("!! user not found !!");
  const address = user.address;
  if (address.length == 0)
    return res.status(200).send("!! no address saved !!");
  return res.status(200).send(address);
}

async function getUser(req, res) {
  const _id = req.params.id;
  const user = await userModel.findOne({ _id });
  if (!user) return res.status(404).json({ user: "!! not found !!" });
  res.status(200).json({ user });
}

module.exports = {
  register,
  login,
  logout,
  changePassword,
  me,
  address,
  update,
  addresses,
  getUser,
};
