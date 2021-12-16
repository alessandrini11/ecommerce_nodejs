const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { check, body } = require('express-validator')
const User = require('../models/user')

router.get('/login', authController.getLogin)
router.post('/login',authController.postLogin)
router.post('/logout',authController.postLogout)
router.get('/signup',authController.getSignUp)
router.post(
    '/signup',
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, {req}) => {
            if (value === 'test@test.com') {
                throw new Error('this email address is forbiden')   
            }
            return true
            
        }),
        body('password','Please enter a password with at least 5 characters')
        .isLength({min: 5})
        .isAlphanumeric(),
        body('confirmPassword')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match')
            }
            return true
        })
    ]
    ,
    authController.postSignUp
)
router.get('/reset',authController.getReset)
module.exports = router