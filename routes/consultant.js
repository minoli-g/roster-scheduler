var express = require('express');
var router = express.Router();
var consultantController = require('../controllers/consultantController')

/* GET localhost/example page */
router.get('/', function(req, res, next) {
  res.send('respond with a resouurce');
});

//router.get('/page',consultantController.page);

//GET routes
router.get('/create',consultantController.createWardPage);
//router.get('/add',consultantController.addDoctorPage);
//router.get('/edit')
//router.get('/ward/:wid',consultantController.wardPage);

//POST routes
router.post('/create',consultantController.createWard);

module.exports = router;