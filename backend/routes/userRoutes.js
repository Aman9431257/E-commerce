const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const cloudinary = require("cloudinary");

const User = require('../db/models/userModel.js');

const errorHandler = require('../utils/errorHandler.js');
const asyncError = require('../middlewares/asyncErrors.js');
const sendToken = require('../utils/jwtToken.js');
const sendEmail = require("../utils/sendEmail");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth.js");

router.route('/signup').post(asyncError(async (req, res) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
    }
  });

  sendToken(user, 200, res);
}));

router.route('/login').post(asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new errorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new errorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
}));

router.route('/logout').get(asyncError(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
}));

router.route('/password/forgot').post(asyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new errorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `E-commerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new errorHandler(error.message, 500));
  }
}));

router.route('/password/reset/:token').put(asyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new errorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new errorHandler("passwords does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
}));

router.route('/me').get(isAuthenticatedUser, asyncError(async (req, res) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    user
  });
}));

router.route('/password/update').put(isAuthenticatedUser, asyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new errorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new errorHandler("passwords does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
}));

router.route('/profile/update').put(isAuthenticatedUser, asyncError(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  sendToken(user, 200, res);
}));

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles("admin"), asyncError(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  })
}));

router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles("admin"),  asyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new errorHandler('User not Found', 404));
  }

  res.status(200).json({
    success: true,
    user
  });
}));

router.route('/admin/user/:id').put(isAuthenticatedUser, authorizeRoles("admin"), asyncError(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  sendToken(user, 200, res);
}));

router.route('/admin/user/:id').delete(isAuthenticatedUser, authorizeRoles("admin"), asyncError(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new errorHandler('User not Found', 404));
  }

  await User.deleteOne({
    _id: req.params.id
  })

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully"
  });
}));

module.exports = router;