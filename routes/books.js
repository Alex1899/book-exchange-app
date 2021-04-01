const express = require("express");
const router = express.Router();
const Book = require("../model/bookSchema");
const bookController = require("../controllers/bookController");

router.post("/list", bookController.addBookToDB);

router.post("/search", bookController.searchBook);

router.post("/request", bookController.requestBook)
router.post("/cancel-request", bookController.cancelRequest)

router.post("/:id", bookController.checkIfBookRequested);

router.get("/:id", bookController.getBookById);

/* GET all user's books */
router.get("/:userId", (req, res, next) => {
  res.send("respond with a resource");
});

module.exports = router;
