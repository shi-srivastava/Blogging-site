const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

function initialize(passport, getUserByEmail) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email);
        if (user == null) {
            return done(null, false, { message: 'No user registered with that email' })
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(user)
            } else {
                return done(null, false, {
                    message: 'incorrect password'
                })
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        done(null, getUserByID(id))
    })
}

module.exports = initialize;