const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new KakaoStrategy({
      clientID: process.env.KAKAO_ID,
      callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
      try {
          // 카카오가 profile 객체로 정보를 전달해준다.
          // sns 권한에 따라 내용물이 다르니 console.log 로 확인해보자..
        const exUser = await User.findOne({ where: { snsId: profile.id, 
          provider: 'kakao' } });
       
        if (exUser) {
          done(null, exUser);
        } else {
          const newUser = await User.create({
            email: profile._json && profile._json.kaccount_email,
            nick: profile.displayName,
            snsId: profile.id,
            provider: 'kakao',
          });
          done(null, newUser);
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }));
  };