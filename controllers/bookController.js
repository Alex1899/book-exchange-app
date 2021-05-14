const { cloudinary } = require("../utils/cloudinary");
const Book = require("../model/bookSchema");
const User = require("../model/userSchema");
const { sendMail } = require("../emailer/emailer");
const createError = require("http-errors");

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

    await User.findOneAndUpdate(
      { _id: data.ownerId },
      {
        $addToSet: {
          currentlySelling: { book: savedBook._id, date: new Date() },
        },
      },
      { new: true }
    );
    console.log("book added to user's selling list ");

    res.send({ bookId: savedBook._id });
  } catch (e) {
    console.log(e);
    res.status(400).send({ errors: { msg: e.message } });
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
  let filter = {}
  Object.keys(data).forEach(key=> filter[key] = {"$regex":  data[key], "$options": "i"})

  const books = await Book.find({...filter });

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
      { $addToSet: { requestedBooks: { book: bookId, date: new Date() } } },
      { new: true }
    );
    console.log("book added to user's requested list ");

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
      { $pull: { requestedBooks: { book: bookId } } },
      { new: true }
    );
    console.log("book request cancelled ");

    const book = await Book.findOneAndUpdate(
      { _id: bookId },
      { status: "selling" },
      { new: true }
    );
    console.log("book status updated to selling ", book.status === "selling");
    const bookOwner = await User.findOne({ _id: book.ownerId });
    // const bookOwner = await User.findOneAndUpdate(
    //   { _id: book.ownerId },
    //   { $addToSet: { currentlySelling: bookId } },
    //   { new: true }
    // );
    // console.log(
    //   "book returned to owner's selling list ",
    //   bookOwner.currentlySelling.includes(bookId)
    // );

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

  let obj = user.requestedBooks.find(
    (obj) => obj.book.toString() === id.toString()
  );
  let requested = obj ? true : false;
  res.send({ requested });
};

module.exports.getBookById = async (req, res, next) => {
  const { id } = req.params;
  console.log("id", id);

  const book = await Book.findOne({ _id: id });

  if (!book) {
    console.log(createError(404, "Book not found"));
    return res
      .status(404)
      .send({ errors: { msg: "Book not found with these details" } });
  }

  res.send({ book });
};

module.exports.getBookRequester = async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({ requestedBooks: { $elemMatch: {book: id } } });

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
      { $pull: { currentlySelling: { book: id } } },
      { new: true }
    );
    console.log("seller =>", seller.username);
    console.log("book removed from seller's list ");

    // check if seller has already sold this book before
    let soldBefore = seller.soldBooks.find(
      ({ book }) => book._id.toString() === id.toString()
    );
    if (soldBefore) {
      console.log(
        "this book has been sold before by the seller, so only the date will be updated"
      );
      await seller.updateOne(
        { $set: { "soldBooks.$[el].date": new Date() } },
        { arrayFilters: [{ "el.book": id }] }
      );
    } else {
      await seller.updateOne({
        $addToSet: { soldBooks: { book: id, date: new Date() } },
      });
      console.log("book added to seller's sold books list ");
    }

    // check if buyer had already bought this book before
    const buyer = await User.findOne({ _id: buyerId });
    let bookAlreadyExists = buyer.purchasedBooks.find(
      (item) => item.book._id.toString() === id.toString()
    );
    if (bookAlreadyExists) {
      console.log("book already exists in buyers purchased book");
      await buyer.updateOne(
        { $set: { "purchasedBooks.$[el].date": new Date() } },
        { arrayFilters: [{ "el.book": id }] }
      );
    } else {
      await buyer.updateOne({
        $addToSet: { purchasedBooks: { book: id, date: new Date() } },
      });
    }

    console.log("book added to buyer's list ");

    await buyer.updateOne({ $pull: { requestedBooks: { book: id } } });
    console.log("book removed from buyers requested list");

    const mailToBuyer = {
      from: process.env.SERVER_EMAIL,
      to: buyer.email,
      subject: `Southampton Uni Book Exchange - Book "${book.title}" Purchased Successfully`,
      text: `Hello, ${buyer.fullname}! \nYou have purchased the book "${book.title}" successfully.\n\nYou can add the review of the book on the book page if you wish.\n\nThank you very much.\n\nBest regards,\nBook Exchange Team`,
    };

    const mailToSeller = {
      from: process.env.SERVER_EMAIL,
      to: seller.email,
      subject: `Southampton Uni Book Exchange - Book "${book.title}" Sold Successfully`,
      text: `Hello, ${seller.fullname}! \nYou have sold the book "${book.title}" successfully.\n\nThank you very much.\n\nBest regards,\nBook Exchange Team`,
    };

    // sendMail(mailToBuyer);
    // sendMail(mailToSeller);

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
      { $addToSet: { currentlySelling: { book: id, date: new Date() } } },
      { new: true }
    );
    console.log("book added to user's selling list ");

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

module.exports.addReview = async (req, res, next) => {
  const { bookId, userId, review } = req.body;
  console.log(req.body);
  try {
    const book = await Book.findOneAndUpdate(
      { _id: bookId },
      {
        $push: {
          reviews: {
            userId,
            rating: review.rating,
            comment: review.comment,
            headline: review.headline,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    console.log("review added to the books review list");
    res.send({ reviews: book.reviews });
  } catch (e) {
    console.log(e);
    res.status(500).send({ errors: { msg: "Error while adding the review" } });
  }
};

module.exports.getUsersBookByType = async (req, res, next) => {
  const { id, type } = req.params;

  if (!id) return res.status(400).send({ errors: { msg: "UserId is null" } });

  const user = await User.findOne({ _id: id });
  if (!user)
    return res
      .status(400)
      .send({ errors: { msg: "User not found with this id" } });

  let books;
  if (type === "allBooks") {
    books = await Book.find({ ownerId: id });
  } else {
    await user
      .populate({
        path: type,
        populate: {
          path: "book",
        },
      })
      .execPopulate();

    books = user[type];
    console.log(books)
  }

  res.send({ books: books.reverse() });
};

module.exports.cancelSelling = async (req, res, next) => {
  const { bookId, userId } = req.body;
  try {
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { currentlySelling: { book: bookId } } }
    );

    const book = await Book.findOneAndUpdate(
      { _id: bookId },
      { status: "sold" },
      { new: true }
    );
    res.send({ status: book.status });
  } catch (e) {
    res.send({ errors: { msg: e.message } });
  }
};

module.exports.deleteBook = async (req, res, next) => {
  const { bookId, userId } = req.body;
  try {
    const book = await Book.findOne({ _id: bookId });
    const user = await User.findOne({ _id: userId });
    if (book.ownerId.toString() !== user._id.toString()) {
      return res
        .status(400)
        .send({ errors: { msg: "You can not delete this book" } });
    }
    await book.deleteOne();
  } catch (e) {
    res.send({ errors: { msg: e.message } });
  }
};
