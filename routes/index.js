var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({msg: "Book Exchange Server!" });
});

module.exports = router;
