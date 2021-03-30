const { cloudinary } = require("../utils/cloudinary");
const Book = require("../model/bookSchema");
const User = require("../model/userSchema");

module.exports.addBookToDB = async (req, res, next) => {
  const {
    ownerId,
    author,
    title,
    subject,
    keyword,
    category,
    photo,
    price,
    condition,
    isbn,
  } = req.body;

  try {
    const uploadedResponse = await cloudinary.uploader.upload(photo, {
      folder: "book-exchange/user-books/" + ownerId + "/",
    });
    console.log("uploaded responce =>", uploadedResponse);

    const book = await Book.create({
      ownerId,
      author,
      title,
      subject,
      keyword,
      category,
      photoId: uploadedResponse.secure_url,
      price,
      status: "selling",
      condition,
      isbn,
    });

    const savedBook = await book.save();

    const user = await User.findOne({ _id: ownerId });

    let currentlySelling = [...user.currentlySelling, savedBook._id];

    await user.updateOne({ currentlySelling });
    res.send({ bookId: savedBook._id });
  } catch (e) {
    console.log("Cloudinary Error", e);
  }
};

module.exports.searchBook = async (req, res, next) => {
  let data = req.body;
  for (let key in data) {
    if (data[key] === '') {
      delete data[key];
    }
  }

  console.log("find", data);

  const books = await Book.find({ ...data });

  if (!books)
    return res
      .status(404)
      .send({ errors: { msg: "Books not found with these details" } });

  res.send({ books });
};


module.exports.getBookById = async (req,res,next) => {
  const {id} = req.params;
  console.log("id", id)

  const book = await Book.findOne({ _id: id});

  if (!book)
    return res
      .status(404)
      .send({ errors: { msg: "Books not found with these details" } });

  res.send({book})
}
