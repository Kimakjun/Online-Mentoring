const express = require('express');

const {User, Post} = require('../models');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();




router.post('/', async (req, res, next)=>{
    const {title, content, date, start, end} = req.body;
    try{
      console.log("userId : ",req.user.id);
        const post = await Post.create({
          title: req.body.title,
          content: req.body.content,
          day: req.body.date,
          start: req.body.start,
          end: req.body.end,
          writerId: req.user.id,
        })
        console.log('post 라우터 입니다.')
        res.redirect('/');
    }catch(error){
        console.error(error);
        next(error);
    }
})


router.get('/:id',isLoggedIn, async (req, res, next) => {
    console.log(req.params.id)
    try{
      const posta = await Post.findOne({
        where : {id : req.params.id},
        include: {
          model: User,
          as: 'writer',
        }
      })
      // console.log('post : ', posta.id);
      console.log(posta);
      res.render('detailpost', {post : posta, user: req.user})
    }catch(error){
      console.error(error);
      next(error);
    }
})


module.exports = router;