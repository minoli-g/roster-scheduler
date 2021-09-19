const { body, validationResult } = require('express-validator');

module.exports.checkCreateWard = () => {
    return [
        body('wardname').isLength({min: 3, max: 20}).withMessage("Ward Name must be between 3 and 20 characters long")
    ]
}