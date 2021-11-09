var express = require('express');
var router = express.Router();

const doctorController = require('../controllers/DoctorController');

const ifLoggedIn = require('../middleware/SessionCheck').ifLoggedIn;
const isDoctor = require('../middleware/SessionCheck').isDoctor;

router.get('/report',doctorController.reportPage);
router.get('/workhrs', doctorController.workhrsPage);
router.get('/leave', doctorController.leavePage);
router.get('/preferences', doctorController.prefPage);

router.get('/roster/:wid',ifLoggedIn,isDoctor,doctorController.allRostersPage);
router.get('/roster/:wid/:y/:m',ifLoggedIn,isDoctor,doctorController.viewRoster);
router.get('/roster/:wid/:y/:m/:uid',ifLoggedIn,isDoctor,doctorController.viewMyRoster);


router.post('/report', doctorController.sendReport);
router.post('/leave', doctorController.submitLeave);
router.post('/preferences', doctorController.submitPreferences);

module.exports = router;