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
    printLength: {
      type: Number,
    },
    language: {
      type: String,
      required: true
    },
    publisher: {
      type: String,
    },
    publicationDate: {
      type: Date
    },
    status: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
    reviews: {
      type: [
        {
          userId: String,
          rating: Number,
          comment: String,
        },
      ],
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
