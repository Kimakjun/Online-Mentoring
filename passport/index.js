const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const redis = require('redis');
const util = require('util');
const {User} = require('../models');

const client = redis.createClient({  host: "127.0.0.1",
port: 6379,});
client.get = util.promisify(client.get);

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser(async (id, done) => {
        const exUser = await client.get(id);
        if(exUser){
            done(null, JSON.parse(exUser));
        }else{
            console.log('캐싱 실패');
            const user = await User.findOne({where : {id}});
            client.set(id, JSON.stringify(user));
            done(null, user);
        }
    })
 
    local(passport);
    kakao(passport);
}