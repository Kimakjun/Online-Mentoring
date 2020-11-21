const express = require('express');

const {Post, User} = require('../models');
const {isLoggedIn} = require('./middlewares');

const Sequelize = require('sequelize');
const router = express.Router();
const Op = Sequelize.Op;

router.get('/', isLoggedIn, async (req, res, next) => {
    try{
        const nmpost = await Post.findAll({
            where: {writerId: req.user.id, applicantId: {[Op.ne]: null} },
            include: {
                model: User,
                as: 'applicant',
                attributes: ['nick'],
            },
        })
        const nmtpost = await Post.findAll({
            where: {applicantId: req.user.id},
            include: {
                model: User,
                as: 'writer',
                attributes: ['nick'],
            },
        })

        res.render('profile', {user : req.user, posts: nmpost, posts2: nmtpost});
    }catch(error){
        console.error(error);
        next(error);
    }

   


})

module.exports = router;

