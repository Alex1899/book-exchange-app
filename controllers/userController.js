const User = require("../model/userSchema");
const Book = require("../model/bookSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const { cloudinary } = require("../utils/cloudinary");
const { restart } = require("nodemon");

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "", fullname: "", username: "" };

  // duplicate error code
  if (err.code === 11000) {
    Object.keys(err.keyValue).forEach((key) => {
      let message;
      if (key === "email") {
        message = "User with this email already exists";
      }

      if (key === "username") {
        message = "User with this username already exists";
      }

      errors[key] = message;
    });
  }

  // validation errros
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.message.includes("duplicate key error")) {
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "ajfhakjbfnal1931ou424ljanl", {
    expiresIn: maxAge,
  });
};

module.exports.registerUser = async function (req, res, next) {
  console.log("Post data =>", req.body);
  const { fullname, username, email, password } = req.body;

  try {
    // if (userData.password !== userData.passwordCheck)
    //   return res.status(400).send({ msg: "Passwords do not match." });
    let default_avatar =
      "https://res.cloudinary.com/alekoscloud/image/upload/v1616778147/book-exchange/user-avatars/default/user_wf8ww4.jpg";

    const checkUserEmail = await User.findOne({ email });
    if (checkUserEmail) {
      return res
        .status(400)
        .send({ errors: { msg: "User with this email already exists" } });
    }

    const checkUserUsername = await User.findOne({ username });
    if (checkUserUsername) {
      return res
        .status(400)
        .send({ errors: { msg: "User with this username already exists" } });
    }

    const user = await User.create({
      fullname,
      username,
      email,
      password,
      avatar: default_avatar,
      soldBooks: [],
      requestedBooks: [],
      currentlySelling: [],
      purchasedBooks: [],
    });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.send({
      username: user.username,
      userId: user._id,
      avatar: user.avatar,
      soldBooks: user.soldBooks,
      requestedBooks: user.requestedBooks,
      currentlySelling: user.currentlySelling,
      purchasedBooks: user.purchasedBooks,
    });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).send({ errors });
  }
};

module.exports.loginUser = async function (req, res, next) {
  const userData = req.body;
  console.log(userData);

  const user = await User.findOne({ email: userData.email });
  console.log(user);

  if (!user)
    return res
      .status(400)
      .send({ errors: { msg: "User not found with these details" } });

  const match = await bcrypt.compare(userData.password, user.password);

  if (!match) {
    return res
      .status(400)
      .send({ errors: { msg: "Incorrect password for this user" } });
  }

  await user
    .populate("currentlySelling")
    .populate("soldBooks")
    .populate("purchasedBooks")
    .populate("requestedBooks")
    .execPopulate();

  res.send({
    username: user.username,
    userId: user._id,
    avatar: user.avatar,
    requestedBooks: user.requestedBooks,
    soldBooks: user.soldBooks,
    currentlySelling: user.currentlySelling,
    purchasedBooks: user.purchasedBooks,
  });
};

module.exports.updateUserAvatar = async function (req, res, next) {
  const { userId, avatar } = req.body;

  const uploadedResponse = await cloudinary.uploader.upload(avatar, {
    folder: "book-exchange/user-avatars/" + userId + "/",
  });
  console.log("uploaded responce =>", uploadedResponse);

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { avatar: uploadedResponse.secure_url },
    {new: true}
  );
  if (!user) {
    return res
      .status(500)
      .send({ errors: { msg: "Error when updating user avatar" } });
  }
  res.send({ avatar: user.avatar });
  console.log("Updated user avatar in database...");
};

module.exports.getBooksCount = async function (req, res, next) {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  let counts = {
    purchased: user.purchasedBooks.length,
    sold: user.soldBooks.length,
    selling: user.currentlySelling.length,
  };

  res.send({ counts });
};

module.exports.getUserBooks = async function (req, res, nex) {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });
  try {
    await user
      .populate("currentlySelling")
      .populate("soldBooks")
      .populate("purchasedBooks")
      .populate("requestedBooks")
      .execPopulate();
  } catch (e) {
    res.status(500).send({ errors: { msg: "Error while getting user books" } });
  }

  res.send({
    currentlySelling: user.currentlySelling.reverse(),
    soldBooks: user.soldBooks.reverse(),
    purchasedBooks: user.purchasedBooks.reverse(),
    requestedBooks: user.requestedBooks.reverse(),
  });
};
