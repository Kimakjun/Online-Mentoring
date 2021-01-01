const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');

const {User} = require('../models');

const userList = [];
const MAX_SIZE = 10;

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser(async (id, done) => {
        let deletedIndex = '';

        const exUser = userList.filter((user, i) =>{
            if(user.id === id){
                deletedIndex = i;
                return true;
            }
        })[0];  
   
        if(exUser){
            userList.push(userList.splice(deletedIndex, 1)[0]);
            done(null, exUser);
        }else{
            const user = await User.findOne({where : {id}});
            if(userList.length >= MAX_SIZE) userList.shift();
            userList.push(user);
            done(null, user);
        }
    })
 
    local(passport);
    kakao(passport);
}