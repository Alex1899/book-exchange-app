const { cloudinary } = require("../utils/cloudinary");
const Book = require("../model/bookSchema");
const User = require("../model/userSchema");
const { sendMail } = require("../emailer/emailer");

module.exports.addBookToDB = async (req, res, next) => {
  let data = req.body;
  const photoFile = req.body.photo;
  delete data["photo"];
  console.log(data);

  try {
    const uploadedResponse = await cloudinary.uploader.upload(photoFile, {
      folder: "book-exchange/user-books/" + data.ownerId + "/",
    });
    console.log("uploaded responce =>", uploadedResponse);

    const book = await Book.create({
      ...data,
      photoId: uploadedResponse.secure_url,
      status: "selling",
    });

    const savedBook = await book.save();

    const user = await User.findOne({ _id: data.ownerId });

    let currentlySelling = [...user.currentlySelling, savedBook._id];

    await user.updateOne({ currentlySelling });
    res.send({ bookId: savedBook._id });
  } catch (e) {
    console.log(e);
  }
};

module.exports.searchBook = async (req, res, next) => {
  let data = req.body;
  for (let key in data) {
    if (data[key] === "") {
      delete data[key];
    }
  }

  console.log("find", data);

  const books = await Book.find({ ...data });

  if (!books)
    return res
      .status(404)
      .send({ errors: { msg: "Books not found with these details" } });

  res.send({ books: books.reverse() });
};

module.exports.requestBook = async (req, res, next) => {
  const { bookId, userId } = req.body;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res
      .status(404)
      .send({ errors: { msg: "User not found with this ID" } });
  }

  if (!user.requestedBooks.includes(bookId)) {
    let requestedBooks = [...user.requestedBooks, bookId];

    try {
      await user.updateOne({ requestedBooks });
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .send({ errors: { msg: "Error while requesting a book" } });
    }

    const book = await Book.findOne({ _id: bookId });
    await book.updateOne({ status: "sold" });

    let bookOwner = await User.findOne({ _id: book.ownerId });

    const mailToOwner = {
      from: process.env.SERVER_EMAIL,
      to: bookOwner.email,
      subject: `Southampton Uni Book Exchange - Request For Book "${book.title}"`,
      text: `Hello, ${bookOwner.fullname}! \n\nYour book "${book.title}" has been requested. Please, contact ${bookOwner.fullname} at ${user.email} to arrange for exchange. \n\nMany thanks,\nBook Exchange Team`,
    };

    const mailToBuyer = {
      from: process.env.SERVER_EMAIL,
      to: user.email,
      subject: `Southampton Uni Book Exchange - Request For Book "${book.title}"`,
      text: `Hello, ${user.fullname}! \n\nYour request for the "${book.title}" book has been noted. You will be contacted by the seller within 48 hours to arrange for the exchange.\n\nThank you very much.\n\nBest regards,\nBook Exchange Team`,
    };

    sendMail(mailToOwner);
    sendMail(mailToBuyer);

    res.send({ status: "Book request successfull" });
  } else {
    res.send({ status: "Book already requested" });
  }
};

module.exports.cancelRequest = async (req, res, next) => {
  const { bookId, userId } = req.body;

  const user = await User.findOne({ _id: userId });
  console.log("book requested =", user.requestedBooks.includes(bookId));
  console.log("before", user.requestedBooks);
  let requestedBooks = user.requestedBooks;

  let filteredArr = requestedBooks.filter((id) => id.toString() !== bookId);
  const book = await Book.findOne({ _id: bookId });
  await book.updateOne({ status: "selling" });

  try {
    await user.updateOne({ requestedBooks: filteredArr });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ errors: { msg: "Error while cancelling the request" } });
  }
  let bookOwner = await User.findOne({ _id: book.ownerId });
  console.log("owner", bookOwner.fullname)

  const mailToOwner = {
    from: process.env.SERVER_EMAIL,
    to: bookOwner.email,
    subject: `Southampton Uni Book Exchange - Request For Book "${book.title}" CANCELLED`,
    text: `Hello, ${bookOwner.fullname}! \n\nThe request for your book has been cancelled. There, is no need to contact the user.\n\nMany thanks,\nBook Exchange Team`,
  };

  const mailToBuyer = {
    from: process.env.SERVER_EMAIL,
    to: user.email,
    subject: `Southampton Uni Book Exchange - Request For Book "${book.title}" CANCELLED`,
    text: `Hello, ${user.fullname}! \nYour request for "${book.title}" has been cancelled.\n\nThank you very much.\n\nBest regards,\nBook Exchange Team`,
  };

  sendMail(mailToOwner);
  sendMail(mailToBuyer);

  res.send({ status: "Book request cancelled" });
};

module.exports.checkIfBookRequested = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.body;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res
      .status(404)
      .send({ errors: { msg: "User not found with this ID" } });
  }
  let requested = user.requestedBooks.includes(id);

  res.send({ requested });
};

module.exports.getBookById = async (req, res, next) => {
  const { id } = req.params;
  console.log("id", id);

  const book = await Book.findOne({ _id: id });

  if (!book)
    return res
      .status(404)
      .send({ errors: { msg: "Books not found with these details" } });

  res.send({ book });
};
