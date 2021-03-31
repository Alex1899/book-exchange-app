var express = require("express");
var router = express.Router();
const User = require("../model/userSchema");
const userController = require("../controllers/userController");

/* GET users listing. */
router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/avatar", userController.updateUserAvatar);

router.get("/:id/books-count", userController.getBooksCount);

router.get("/:id/books/:type", userController.getUserBooks)

router.get("/:username", async function (req, res, next) {
  const { username } = req.params;
  console.log("username => ", username);

  const user = await User.findOne({ username });
  if (!user) return res.send({ msg: "User not found" });

  res.send({ username, avatar: user.avatar });
});

module.exports = router;
