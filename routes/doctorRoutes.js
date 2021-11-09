const router = require('express').Router();
const {login_Initial,login_refresh,logout,apply_leave,send_report,select_preference,
     edit_profile,change_password,work_hours,view_leave,view_report, list_doctors, list_wards, roster,doctor,getPre, countPre}= require('../controllers/DoctorController')
const verifyjwt= require('../middleware/verifyJWT');


router.post("/login",login_Initial, async (req,res) => {
     res.status(200).json({auth: req.auth, token: req.token, result: req.result, cookie: req.cookie});
});

router.post("/leave", verifyjwt, apply_leave,async (req,res) => {
     res.status(200).json({result: req.result});
});

router.post('/report', verifyjwt, send_report,async (req,res) => {
     res.status(200).json({result: req.result});
});
router.post('/preslot', verifyjwt, select_preference,async (req,res) => {
     res.status(200).json({message: req.result});
});
router.post('/edit', verifyjwt, edit_profile, async (req,res) => {
     res.status(200).json({auth: req.auth, result: req.result});
});
router.post('/password',verifyjwt, change_password ,async (req,res) => {
     res.status(200).json({message: req.result});
})


router.get('/login', verifyjwt, login_refresh,async (req,res) => {
     res.status(200).json({result : req.result});
});
router.get('/logout', verifyjwt, logout,async (req,res) => {
     res.status(200).json({message: req.result});
});
router.get('/viewleave', verifyjwt, view_leave,async (req,res) => {
     res.status(200).json({result : req.result});
});
router.get('/viewreport', verifyjwt, view_report,async (req,res) => {
     res.status(200).json({result : req.result});
})

router.get('/doctors', verifyjwt, list_doctors, async (req,res)=>{
     res.status(200).json({result : req.result})
})

router.get('/selectedSlots', verifyjwt, getPre, async (req,res)=>{
     res.status(200).json({result : req.result})
})

router.get('/countPre', verifyjwt, countPre, async (req,res)=>{
     res.status(200).json({result : req.result})
})
router.get('/doctor', verifyjwt, doctor, async (req,res)=>{
     res.status(200).json({result : req.result})
})
router.get('/wards', verifyjwt, list_wards, async (req,res)=>{
     res.status(200).json({result : req.result})
})
router.get('/roster', verifyjwt, roster, async (req,res)=>{
     res.status(200).json({result : req.result})
})

router.get('/hours', verifyjwt, work_hours, async (req,res)=>{
     res.status(200).json({result : req.result})
})

module.exports= router