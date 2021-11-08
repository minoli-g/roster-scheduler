const { body, validationResult } = require('express-validator');

module.exports.checkCreateWard = () => {
    return [
        body('wardname').notEmpty().withMessage("Please enter a Ward name").
        isLength({min: 3, max: 20}).withMessage("Ward Name must be between 3 and 20 characters long"),
        body('startmonth').notEmpty().withMessage("Please select a start month").
        custom((value,{req}) =>(new Date(value) > new Date())).withMessage("Please select a future month")
    ]
}

module.exports.checkEditParams = () => {
    return[
        body('min_docs').notEmpty().withMessage("Please enter minimum number of doctors").
        isInt({min: 1, max: 10}).withMessage("Number of doctors should be between 1 and 10"),
        body('morning_start').notEmpty().withMessage("Choose a morning shift start time").
        custom((value,{req}) => value < req.body.day_start).
        withMessage("Morning shift should start before day shift does"),
        body('day_start').notEmpty().withMessage("Choose a day shift start time").
        custom((value,{req}) => value < req.body.night_start).
        withMessage("Day shift should start before night shift does"),
        body('night_start').notEmpty()
    ]
}