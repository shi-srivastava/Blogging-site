const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
router.use(cookieParser());
router.get('/register', (req, res) => {
    res.render('login_signup');
});

router.post('/register', async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log(req.body);
        console.log(`hashedPassword: ${hashedPassword}`)
        const user = new User({
            username: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        await user.save();
        res.redirect('/login')
    } catch (e) {
        res.redirect('register')
    }
});

router.get('/login', (req, res) => {
    res.render('login_signup');
});

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), (req, res) => {
    let str ="/"+req.body.email
    console.log(`${str} and ${req.body.email}`)
    res.cookie("email",req.body.email)
    // const redirectUrl = req.session.returnTo || str;
    const redirectUrl = '/home';
    delete req.session.returnTo;
    console.log(redirectUrl)
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})

module.exports = router;