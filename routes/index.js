const express = require('express');

const {Post, User} = require('../models');

const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();



router.get('/', async (req, res, next) => {
    console.log('메인 라우터 입니다.')
    const posts = await Post.findAll({
        where :{ applicantId : null},

        include : {
         model: User,
         as : 'writer',
         attributes: ['id', 'nick']}
    })

    res.render('main', {title : "test", user : req.user, posts});
})

router.get('/login', (req, res, next) => {
    res.render('login',{title : "test", user : req.user, loginError: req.flash('loginError')} );
})

router.get('/join', (req, res, next) => {
    res.render('join', {user : req.user,  joinError: req.flash('joinError') } );
})


router.get('/post', isLoggedIn, (req, res, next) => {
    res.render('post',{title : "test", user : req.user} );

})


module.exports = router;