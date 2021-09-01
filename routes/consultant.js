var express = require('express');
var router = express.Router();
var consultantController = require('../controllers/consultantController')

/* GET localhost/example page */
router.get('/', function(req, res, next) {
  res.send('respond with a resouurce');
});

//router.get('/page',consultantController.page);

module.exports = router;