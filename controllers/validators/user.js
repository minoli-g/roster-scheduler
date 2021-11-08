const { body, validationResult } = require('express-validator');

module.exports.registrationReq = () => {
    return [
        body('first_name').notEmpty().withMessage("Please enter your first name").
        isLength({min: 2, max:20}).withMessage("First name should be between 2 and 20 characters"),
        body('last_name').notEmpty().withMessage("Please enter your last name").
        isLength({min: 2, max:20}).withMessage("Last name should be between 2 and 20 characters"),
        body('username').notEmpty().withMessage("Please enter an username you wish to use").
        isLength({min: 5, max:20}).withMessage("Username should be between 5 and 20 characters"),
        body('type').notEmpty().withMessage("Please choose whether you wish to take Doctor or Consultant role"),
        body('pwd2').notEmpty().withMessage("Please re-enter the password"),
        body('pwd1').notEmpty().withMessage("Please enter a password").
        isLength({min:6, max: 20}).withMessage("Password should be between 6 and 20 characters").
        custom((value,{req}) => value==req.body.pwd2).withMessage("Passwords do not match")
    ]
}