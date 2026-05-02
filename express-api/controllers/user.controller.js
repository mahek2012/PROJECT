const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const orderModel = require("../models/order.model");
const wishlistModel = require("../models/wishlist.model");


module.exports.registerUser = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { username, email, password, role } = req.body;

  // check user is already registed or not
  let isExist = await userModel.findOne({ email: email });

  if (isExist) {
    return res.status(400).json({ message: "user is already register" });
  }

  const hashPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    username,
    email,
    password: hashPassword,
    role,
  });

  let token = await user.generateAuthToken();

  res.status(200).json({ token, user });
};

module.exports.loginUser = async (req, res) => {
  let error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { email, password } = req.body;

  let checkUser = await userModel.findOne({ email: email }).select("+password");

  if (!checkUser) {
    return res.status(401).json({ message: "Email is invaild" });
  }

  if (checkUser.status === "blocked") {
    return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
  }

  const isMatch = await checkUser.comparePassword(password);


  if (!isMatch) {
    return res.status(400).json({ message: "Wrong Password" });
  }

  const token = checkUser.generateAuthToken();
  res.cookie("token", token);

  res.status(200).json({ token, user: checkUser });
};

module.exports.profile = (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports.getProfileStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderCount = await orderModel.countDocuments({ userId });
    const wishlistCount = await wishlistModel.countDocuments({ userId });

    res.status(200).json({
      success: true,
      stats: {
        orderCount,
        wishlistCount
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logout Successfully !!" });
};

module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, username, email, phone, profilePhoto, preferences } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          fullName,
          username,
          email,
          phone,
          profilePhoto,
          preferences
        }
      },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.manageAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const { action, address, addressId } = req.body; // action: add, update, delete, setDefault

    let user = await userModel.findById(userId);

    if (action === "add") {
      user.addresses.push(address);
    } else if (action === "update") {
      const idx = user.addresses.findIndex(a => a._id.toString() === addressId);
      if (idx !== -1) user.addresses[idx] = { ...user.addresses[idx], ...address };
    } else if (action === "delete") {
      user.addresses = user.addresses.filter(a => a._id.toString() !== addressId);
    } else if (action === "setDefault") {
      user.addresses.forEach(a => a.isDefault = a._id.toString() === addressId);
    }

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.upgradeMembership = async (req, res) => {
  try {
    const userId = req.user._id;
    const { plan } = req.body;

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month validity

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          "membership.plan": plan,
          "membership.startDate": new Date(),
          "membership.expiryDate": expiryDate
        }
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: `Upgraded to ${plan}!`, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// forget password --> send email for reset password
module.exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    await userService.forgetPassword(email);

    return res.status(200).json({
      message: "Email Send your Registed Mail Sucessfully. Check Your Mail",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

// reset Password
module.exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const { newPassword } = req.body;

    await userService.resetPassword({ token, newPassword });

    return res.status(200).json({ message: "Password Reset Successfully " });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
