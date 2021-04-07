const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = mongoose.Schema(
  {
    isVerified: {
      type: Boolean, 
      default: false
    },
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
          book: { type: Schema.Types.ObjectId, ref: "Book" },
          date: Date,
        },
      ],
    },
    requestedBooks: {
      type: [
        {
          book: { type: Schema.Types.ObjectId, ref: "Book" },
          date: Date,
        },
      ],
    },
    purchasedBooks: {
      type: [
        {
          book: { type: Schema.Types.ObjectId, ref: "Book" },
          date: Date,
        },
      ],
    },
    currentlySelling: {
      type: [
        {
          book: { type: Schema.Types.ObjectId, ref: "Book" },
          date: Date,
        },
      ],
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
