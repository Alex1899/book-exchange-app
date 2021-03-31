const { cloudinary } = require("../utils/cloudinary");
const Book = require("../model/bookSchema");
const User = require("../model/userSchema");

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
    
    console.log(date)
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
