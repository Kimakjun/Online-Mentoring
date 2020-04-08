const local = require('./localStrategy');

const {User} = require('../models');

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser(async (id, done) => {

        const curUser = await User.findOne({where : {id}});
        done(null, curUser);

    })
 
    local(passport);
}