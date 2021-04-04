const express = require("express");
const router = express.Router();
const Book = require("../model/bookSchema");
const bookController = require("../controllers/bookController");

router.post("/list", bookController.addBookToDB);

router.post("/search", bookController.searchBook);

router.post("/request", bookController.requestBook);

router.post("/cancel-request", bookController.cancelRequest);

router.post("/:id", bookController.checkIfBookRequested);

router.post("/:id/sold", bookController.markBookSold)

router.post("/:id/selling", bookController.sellBook)

router.get("/:id", bookController.getBookById);


router.get("/:id/requested-user", bookController.getBookRequester);

/* GET all user's books */
router.get("/:userId", (req, res, next) => {
  res.send("respond with a resource");
});

module.exports = router;
