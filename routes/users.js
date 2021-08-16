const express = require('express');
const router = express.Router();
const User = require('../models/user');

const passport = require('passport');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');

// const initializePassport = require('../passport-config');
// initializePassport(passport,
//     async (email) => await User.findOne({ email: email }),
//     async (id) => await User.findById(id)
// )

// const sessionConfig = {
//     secret: 'iamthebestdeveloper!',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true,
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge: 1000 * 60 * 60 * 24 * 7
//     }
// }
// app.use(session(sessionConfig));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());



router.get('/register', (req, res) => {
    res.render('login_signup');
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
    res.render('login_signup');
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