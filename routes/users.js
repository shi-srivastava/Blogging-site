const express = require('express');
const router = express.Router();
const User = require('../models/user');

const passport = require('passport');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');



router.get('/register', (req, res) => {
    res.render('users/login_signup');
});

router.post('/register', async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        await user.save();
        res.redirect('/login')
        // const { email, username, password } = req.body;
        // const user = new User({ email, username });
        // const registeredUser = await User.register(user, password);
        // req.login(registeredUser, err => {
        //     if (err) return next(err);
        //     console.log(registeredUser);
        //     res.redirect('/');
        // })
    } catch (e) {
        res.redirect('register')
    }
});

router.get('/login', (req, res) => {
    res.render('users/login_signup');
});

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;