const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please, enter a full name"],
    },
    email: {
      type: String,
      required: [true, "Please, enter an email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    username: {
      type: String,
      required: [true, "Please, enter the username"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please, enter a password"],
      minlength: [6, "Minimum password length is 6 characters"],
    },
    avatar: {
      type: String,
    },

    soldBooks: {
      type: [
        {
          type: String,
          unique: true,
        },
      ],
      required: true,
      sparse: true,
    },
    purchasedBooks: {
      type: [
        {
          type: String,
          unique: true,
        },
      ],
      required: true,
      sparse: true,
    },
    currentlySelling: {
      type: [
        {
          type: String,
          unique: true,
        },
      ],
      required: true,
      sparse: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

// hash password befor saving to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
