const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {User} = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async(email, password, done) => {
        try{
            const checkUser = await User.findOne({where: {email}});
            if(checkUser){
                const result = await bcrypt.compare(password, checkUser.password);
                if(result){
                    console.log('sucssec')
                    done(null, checkUser);
                }else{
                    done(null, false, {msg: '비밀번호가 일치하지 않습니다.'});
                }
            }else{
                done(null, false, {msg : '가입되지 않은 회원입니다.'});
            }
        }catch(error){
            console.log(error);
            done(error);
        }
    }))
}