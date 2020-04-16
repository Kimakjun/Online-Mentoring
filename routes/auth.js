const express = require('express');

const {User} = require('../models');
const passport = require('passport');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/join', async (req, res, next) => {
    const { email, nick, password, info } = req.body;
    try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        req.flash('joinError', '이미 가입된 이메일입니다.');
        return res.redirect('/join');
      }
      const hash = await bcrypt.hash(password, 12);
      await User.create({
        email,
        nick,
        info,
        password: hash,
      });
      return res.redirect('/login');
    } catch (error) {
      console.error(error);
      return next(error);
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        req.flash('loginError', info.msg);
        return res.redirect('/login');
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        return res.redirect('/');
      });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
  });

 router.get('/logout', (req, res, next) => {
     req.logout();
     res.redirect('/');
 }) 

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

 module.exports = router;