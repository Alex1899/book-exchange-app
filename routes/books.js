const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Book = require("../model/bookSchema");
const bookController = require("../controllers/bookController");

router.post("/list", bookController.addBookToDB);
router.post("/search", bookController.searchBook);
router.post("/request", bookController.requestBook);
router.post("/add-review", bookController.addReview)
router.post("/cancel-request", bookController.cancelRequest);
router.post("/:id", bookController.checkIfBookRequested);
router.post("/:id/sold", bookController.markBookSold)
router.post("/:id/selling", bookController.sellBook)

router.get("/:id", bookController.getBookById);
router.get("/:id/:type", bookController.getUsersBookByType)
router.get("/:id/requested-user", bookController.getBookRequester);

/* GET all user's books */
router.get("/:userId", (req, res, next) => {
  res.send("respond with a resource");
});

router.use((req, res)=> {
  createError(404, "Page not found")
  res.status(404).send("Page not found")
})

module.exports = router;
