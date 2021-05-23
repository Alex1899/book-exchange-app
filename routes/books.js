const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Book = require("../model/bookSchema");
const bookController = require("../controllers/bookController");
const { checkjwt, csrfProtection } = require("../controllers/utils");


router.post("/search", bookController.searchBook);
router.get("/:id", bookController.getBookById);

router.use(checkjwt);
router.use(csrfProtection);

router.post("/list", bookController.addBookToDB);
router.post("/request", bookController.requestBook);
router.post("/add-review", bookController.addReview);
router.post("/cancel-request", bookController.cancelRequest);
router.post("/cancel-selling", bookController.cancelSelling);
router.post("/delete", bookController.deleteBook);
router.post("/:id", bookController.checkIfBookRequested);
router.post("/:id/sold", bookController.markBookSold);
router.post("/:id/selling", bookController.sellBook);

router.get("/:id/requested-user", bookController.getBookRequester);
router.get("/:id/:type", bookController.getUsersBookByType);


/* GET all user's books */
router.get("/:userId", (req, res, next) => {
  res.send("respond with a resource");
});

router.use((req, res) => {
  createError(404, "Page not found");
  res.status(404).send("Page not found");
});

module.exports = router;
