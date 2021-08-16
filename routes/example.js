var express = require('express');
var router = express.Router();
var exampleController = require('../controllers/exampleController')

/* GET localhost/example page */
router.get('/', function(req, res, next) {
  res.send('respond with a resrce');
});

router.get('/page',exampleController.page);

module.exports = router;
