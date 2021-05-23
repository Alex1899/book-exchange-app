const User = require("../model/userSchema");
const Token = require("../model/verifytokenSchema");
const bcrypt = require("bcrypt");

const crypto = require("crypto");
const jwtDecode = require("jwt-decode");
const { cloudinary } = require("../utils/cloudinary");
const { OAuth2Client } = require("google-auth-library");
const { sendMail } = require("../emailer/emailer");
const { handleErrors, createToken } = require("./utils");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    const token = await Token.create({
      email,
      token: crypto.randomBytes(16).toString("hex"),
    });
    console.log("generated token doc =>", token);
    let verifyLink = `${req.protocol}://localhost:3000/verify-email/${user._id}/${token.token}`;

    let sendToken = {
      from: process.env.SERVER_EMAIL,
      to: email,
      subject: `Southampton Uni Book Exchange - Account Verification Link`,
      text: `Hello, ${fullname}! \n\nPlease follow the link below to verify your account.\n\n${verifyLink}\n\nBest regards,\nBook Exchange Team`,
    };
    sendMail(sendToken);
    console.log("Verify link sent to the user's email...");
    res.send({ status: "Verify email sent" });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).send({ errors: { msg: errors } });
  }
};

module.exports.verifyAccount = async (req, res, next) => {
  const { id, token } = req.body;
  console.log("received", id, token);
  const user = await User.findOne({ _id: id });
  const checkToken = await Token.findOne({ email: user.email });

  if (!checkToken) {
    console.log("Error: No token is tied to this user");
    res.status(400);
    return;
  }
  if (token === checkToken.token) {
    console.log("User verification successful...");
    await user.updateOne({ isVerified: true }, { new: true });
    res.send({ status: "Verification success" });
  } else {
    console.log("User verification failed :(");
    res.status(400).send({ errors: { msg: "Verification failed" } });
  }
};

module.exports.resendVerificationLink = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    console.log("User with this email has not signed up!");
    res.status(400);
    return;
  }
  const token = await Token.findOne({ email });
  if (!token) {
    console.log("Error: There is no token associated to this user");
    res.status(400);
    return;
  }
  let verifyLink = `${req.protocol}://localhost:3000/users/verify-account/${user._id}/${token.token}`;
  let sendToken = {
    from: process.env.SERVER_EMAIL,
    to: email,
    subject: `Southampton Uni Book Exchange - Resent Account Verification Link`,
    text: `Hello, ${user.fullname}! \n\nPlease follow the link below to verify your account.\n\n${verifyLink}\n\nBest regards,\nBook Exchange Team`,
  };
  sendMail(sendToken);
  res.send({ status: "Resent verify email successfully" });
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

  if (!user.isVerified) {
    return res
      .status(400)
      .send({
        errors: {
          msg: `Your account is not verified. Please find the verification link sent to your email at ${user.email}`,
        },
      });
  }
  let userInfo = {
    userId: user._id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
  };
  const jwt_token = createToken(userInfo);
  const decodedToken = jwtDecode(jwt_token);
  const expiresAt = decodedToken.exp;

  res.cookie("jwt", jwt_token, { httpOnly: true });
  res.send({ expiresAt, userInfo });
};

module.exports.logInWithGoogle = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    console.log("No token supplied. Aborting...");
    return;
  }
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();

  const userExists = await User.findOne({ email: email });
  let newUser;
  let finalUser;
  if (!userExists) {
    let password = email + process.env.JWT_TOKEN;
    newUser = await User.create({
      fullname: name,
      username: name,
      email,
      password,
      avatar: picture,
      soldBooks: [],
      requestedBooks: [],
      currentlySelling: [],
      purchasedBooks: [],
    });

    finalUser = newUser;
  } else {
    finalUser = userExists;
  }

  let userInfo = {
    userId: finalUser._id,
    email: finalUser.email,
    username: finalUser.username,
    avatar: finalUser.avatar,
  };
  const jwt_token = createToken(userInfo);
  const decodedToken = jwtDecode(jwt_token);
  const expiresAt = decodedToken.exp;

  res.cookie("jwt", jwt_token, { httpOnly: true });
  res.send({ expiresAt, userInfo });
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
    { new: true }
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
      .populate({
        path: "currentlySelling",
        populate: {
          path: "book",
        },
      })
      .populate({ path: "soldBooks", populate: { path: "book" } })
      .populate({ path: "purchasedBooks", populate: { path: "book" } })
      .populate({ path: "requestedBooks", populate: { path: "book" } })
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

module.exports.getUserAvatar = async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });

  res.send({ avatar: user.avatar });
};

module.exports.getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });

  res.send({ user: { username: user.username, avatar: user.avatar } });
};
