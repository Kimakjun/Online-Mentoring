const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');

const {User} = require('../models');

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser(async (id, done) => {
        console.log(id);
        const user = await User.findOne({where : {id}});
        done(null, user);

    })
 
    local(passport);
    kakao(passport);
}