const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
      sparse: true,
    },

    photoId: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: [true, "Please enter the name of the author"],
    },
    title: {
      type: String,
      required: [true, "Please enter the title of the book"],
    },
    subject: {
      type: String,
      required: [true, "Please enter the subject of the book"],
    },
    keyword: {
      type: String,
      required: [true, "Please enter the keyword of the book"],
    },
    category: {
      type: String,
      required: [true, "Please enter the category of the book"],
    },
    condition: {
      type: String,
      required: [true, "Please enter the condition of the book"],
    },
    isbn: {
      type: String,
    },
    price: {
      type: String,
      required: [true, "Please enter the price of the book"],
    },

    status: {
      type: String,
      required: true
    }

  },
  { timestamps: { createdAt: "created_at" } }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
