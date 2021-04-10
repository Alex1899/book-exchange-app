const express = require("express");
const router = express.Router();
const { checkjwt, csrfProtection} = require("../controllers/utils")
const User = require("../model/userSchema");
const userController = require("../controllers/userController");

router.post("/register", userController.registerUser);
router.post("/verify-email", userController.verifyAccount)
router.post("/resend/verification-link", userController.resendVerificationLink)
router.post("/login", userController.loginUser);
router.post("/auth/google", userController.logInWithGoogle)

router.use(checkjwt)
router.use(csrfProtection)

router.post("/avatar", userController.updateUserAvatar);
router.post("/change/avatar",  userController.updateUserAvatar);
router.get("/:id", userController.getUserById);
router.get("/:id/avatar", userController.getUserAvatar);
router.get("/:id/books-count", userController.getBooksCount);
router.get("/:id/books", userController.getUserBooks);

router.get("/:username", async function (req, res, next) {
  const { username } = req.params;
  console.log("username => ", username);

  const user = await User.findOne({ username });
  if (!user) return res.send({ msg: "User not found" });

  res.send({ username, avatar: user.avatar });
});

router.use((req, res)=> {
  createError(404, "Page not found")
  res.status(404).send("Page not found")
})

module.exports = router;
