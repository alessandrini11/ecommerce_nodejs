const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
exports.getLogin = (req,res,next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/login',{
        path: '/login',
        pageTitle: 'login',
        isAuthenticated:  req.session.isLoggedIn,
        errorMessage: message
    })
}

exports.postLogin = (req,res,next) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password)
            .then(doMatch => {
                if (doMatch) {
                    req.session.user = user
                    req.session.isLoggedIn = true
                    return req.session.save(error => {
                        console.log(error)
                        res.redirect('/')
                    })
                }
                res.redirect('/login')
            })
            .catch(error => {
                console.log(error)
            })
            

        })

}

exports.postLogout = (req,res,next) => {
    req.session.destroy(error => {
        console.log(error)
        res.redirect('/')
    })
}

//get signup page
exports.getSignUp = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/signup',{
        pageTitle: "Sign Up",
        path: '/signup',
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message,
        oldInput:{
            name: "",
            email: "",
            password: "",
            confpwd: ""
        }
    })
}

//submit the sign up form
exports.postSignUp = (req, res, next) => {
    const email = req.body.email
    const name = req.body.name
    const password = req.body.password
    const confpwd = req.body.confirmpwd
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422)
            .render('auth/signup',{
                pageTitle: "Sign Up",
                path: '/signup',
                isAuthenticated: req.session.isLoggedIn,
                errorMessage: message.array()[0].msg,
                oldInput:{
                    name,
                    email,
                    password,
                    confpwd
                }
            })
    }
    User.findOne({email: email})
        .then(userdoc => {
            if (userdoc) {
                req.flash(
                    'error',
                    'E-mail exists already, please pick a different one'
                )
                return res.redirect('/signup')
            }
            return bcrypt.hash(password, 12)
        })
        .then(hashedPassword => {
            const user = new User({
                email: email,
                name: name,
                password: hashedPassword,
                cart: {items: []}
            })
            return user.save()
        })
        .then(result => {
            res.redirect('/login')
        })
        .catch(error => {
            console.log(error)
        })
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/reset',{
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message,
        isAuthenticated:  req.session.isLoggedIn,
    })
}