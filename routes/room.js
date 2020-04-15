const express = require('express');

const router = express.Router();

// 필요한 데이터 베이스, middlewares 가져오기 
const {ChatRoom} = require('../models');
const {isLoggedIn} = require('./middlewares');

// GET /room 요청 => 대기방 화면 렌더링 라우터
router.get('/', isLoggedIn, async (req, res, next) => {
    try{
         const rooms = await ChatRoom.findAll()
         console.log(rooms);
         res.render('room', {title : "test", user : req.user, rooms});
         
    }

    catch(error){
        console.error(error);
        next(error);
    
    }
});

// GET /room/create 요청 => 방생성 화면 렌더링 라우터

router.get('/create', isLoggedIn, (req, res, next) => {
    
    res.render('createroom', {title : 'test', user : req.user});

})


// POST /room 요청 => 방생성 라우터 
router.post('/', async(req, res, next) => {
    const {title, max, password} = req.body;
    try{
        //test 
       const newRoom =  await ChatRoom.create({
            title,
            max,
            password,
            onwer: req.user.nick,
        })
        
        const io = req.app.get('io');
        io.of('/room').emit('newRoom', newRoom);
        res.redirect('/room');
        // 방생성

        // 브라우저에 방생성 정보 전송

        // 방생성자는 방을 만들고 채팅방으로 이동 

       
     res.redirect('/room');   

    }catch(error){
        console.log(error);
        next(error);
    }
})


module.exports = router;