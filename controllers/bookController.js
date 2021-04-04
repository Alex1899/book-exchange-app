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

    const user = await User.findOneAndUpdate(
      { _id: data.ownerId },
      { $addToSet: { currentlySelling: savedBook._id } },
      { new: true }
    );
    console.log(
      "book added to user's selling list ",
      user.currentlySelling.includes(savedBook._id)
    );

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
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { requestedBooks: bookId } },
      { new: true }
    );
    console.log(
      "book added to user's requested list ",
      user.requestedBooks.includes(bookId)
    );

    const book = await Book.findOneAndUpdate(
      { _id: bookId },
      { status: "requested" },
      { new: true }
    );
    console.log(
      "book status updated to requested ",
      book.status === "requested"
    );

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

    // sendMail(mailToOwner);
    // sendMail(mailToBuyer);

    res.send({ status: "Book request successfull" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ errors: { msg: "Error while requesting a book" } });
  }
};

module.exports.cancelRequest = async (req, res, next) => {
  const { bookId, userId } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { requestedBooks: bookId } },
      { new: true }
    );
    console.log(
      "book request cancelled ",
      user.requestedBooks.includes(bookId)
    );

    const book = await Book.findOneAndUpdate(
      { _id: bookId },
      { status: "selling" },
      { new: true }
    );
    console.log("book status updated to selling ", book.status === "selling");

    const bookOwner = await User.findOneAndUpdate(
      { _id: book.ownerId },
      { $addToSet: { currentlySelling: bookId } },
      { new: true }
    );
    console.log(
      "book returned to owner's selling list ",
      bookOwner.currentlySelling.includes(bookId)
    );

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

    // sendMail(mailToOwner);
    // sendMail(mailToBuyer);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ errors: { msg: "Error while cancelling the request" } });
  }

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

module.exports.getBookRequester = async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({ requestedBooks: id });
  if (!user) {
    console.log(`Book ${id} has not been requested by any user`);
    return res.send({ user: null });
  }

  res.send({
    user: { username: user.username, id: user._id, email: user.email },
  });
};

module.exports.markBookSold = async (req, res, next) => {
  const { id } = req.params;
  const { sellerId, buyerId } = req.body;

  try {
    const book = await Book.findOneAndUpdate(
      { _id: id },
      { status: "sold", ownerId: buyerId },
      { new: true }
    );
    console.log("book status updated to sold ", book.status === "sold");

    const seller = await User.findOneAndUpdate(
      { _id: sellerId },
      { $pull: { currentlySelling: id } },
      { new: true }
    );
    console.log("seller =>", seller.username);
    console.log(
      "book removed from seller's list ",
      seller.currentlySelling.includes(id)
    );

    await seller.updateOne({$addToSet: {soldBooks: id}})
    console.log("book added to seller's sold books list ")

    const buyer = await User.findOneAndUpdate(
      { _id: buyerId },
      { $addToSet: { purchasedBooks: id } },
      { new: true }
    );
    console.log(
      "book added to buyer's list ",
      buyer.purchasedBooks.includes(id)
    );

    await buyer.updateOne({ $pull: { requestedBooks: id } });
    console.log("book removed from buyers requested list");

    res.send({
      bookStatus: book.status,
      currentlySelling: seller.currentlySelling.reverse(),
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ errors: { msg: "Error when selling the book" } });
  }
};

module.exports.sellBook = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { currentlySelling: id } },
      { new: true }
    );
    console.log(
      "book added to user's selling list ",
      user.currentlySelling.includes(id)
    );

    const book = await Book.findOneAndUpdate(
      { _id: id },
      { status: "selling" },
      { new: true }
    );
    console.log("book status updated to selling ", book.status === "selling");

    res.send({ status: book.status });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ errors: { msg: "Error when listing a book for sale" } });
  }
};
