const express = require('express');
const schedule = require('node-schedule');
const {User, Post} = require('../models');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();

router.post('/', async (req, res, next)=>{
    const {title, content, date, start, end} = req.body;
    try{
   
        const post = await Post.create({
          title: req.body.title,
          content: req.body.content,
          day: req.body.date,
          start: req.body.start,
          end: req.body.end,
          writerId: req.user.id,
        })
      
        
        const cur = new Date();
        const date = post.day.split("-");
        const minutes = post.start.split(":");
      
        const Month = parseInt(date[1]) - 1;
        const day = parseInt(date[2]);
        const time = parseFloat(post.start);
        const minute = parseInt(minutes[1]);

        cur.setMonth(Month);
        cur.setDate(day);
        cur.setHours(time);
        cur.setMinutes(minute);

        schedule.scheduleJob(cur, async () => {

          if(post.applicantId == null){
             await Post.destroy({where: {id: post.id}});
          }
        })
       
        res.redirect('/');


    }catch(error){
        console.error(error);
        next(error);
    }
})

router.delete('/:id', isLoggedIn, async (req, res, next) => {

    try{
      await Post.destroy({where : {id : req.params.id, writerId: req.user.id}});
      return res.send('OK');  
    }catch(error){
      console.error(error);
      next(error);
    }

})


router.get('/:id',isLoggedIn, async (req, res, next) => {

    try{
      const posta = await Post.findOne({
        where : {id : req.params.id},
        include: {
          model: User,
          as: 'writer',
        }
      })
      res.render('detailpost', {post : posta, user: req.user})
    }catch(error){
      console.error(error);
      next(error);
    }
})

router.post('/:id/match', isLoggedIn, async(req, res, next) => {
  
  try{
      const post = await Post.findOne({where: {id : req.params.id}});
      if(post.writerId == req.user.id){
        return res.status(403).send('본인이 올린공고에 신청하시게요 ? ')
      }else if(post.applicantId){
        return res.status(403).send('이미 매칭된 공고입니다.');
      }
      await Post.update({applicantId: req.user.id}, {where: {id: req.params.id}});
      return res.send('Ok');

     

  }catch(error){
    console.log(error);
    next(error);
  }


});


module.exports = router;