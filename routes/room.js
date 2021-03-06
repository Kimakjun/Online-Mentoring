const express = require('express');

const router = express.Router();

// 필요한 데이터 베이스, middlewares 가져오기 
const {ChatRoom, User, Chat} = require('../models');
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
       const maxNum = max === '' ? 10 : max;
       const newRoom =  await ChatRoom.create({
            title,
            maxNum,
            password,
            onwer: req.user.nick,
        })
        
        const io = req.app.get('io');
        io.of('/room').emit('newRoom', newRoom);
        res.redirect(`/room/${newRoom.id}?password=${req.body.password}`);

    }catch(error){
        console.log(error);
        next(error);
    }
})

router.get('/:id', async (req, res, next) => {
        try{
            const room = await ChatRoom.findOne({where : {id : req.params.id}});
            const io = req.app.get('io');
            if(!room){
                req.flash('roomError', '존재하지 않는 방입니다.');
                return res.redirect('/room');
            }
            if(room.password && room.password !== req.query.password){
                req.flash('roomError', '비밀번호가 틀렸습니다.');
                return res.redirect('/room');
            }
            const {rooms} = io.of('/chat').adapter;
            if(rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length){
                req.flash('roomError', '허용 인원이 초과하였습니다.');
                return res.redirect('/room');
            }
            
            const chats = await Chat.findAll({
                where : {chatroomId : req.params.id},
                include : {model: User},
                order: [['createdAt', 'ASC']],
            })
            
            return res.render('chat', {
                room,
                title: room.title,
                chats,
                user: req.user,
            });

        }catch(error){
            console.error(error);
            next(error);
        }

})

router.delete('/:id', async (req, res, next) => {
    try{
        await Chat.destroy({where : {chatroomId: req.params.id}});
        await ChatRoom.destroy({where: {id : req.params.id}});
        res.send('OK');

        setTimeout(() => {
            req.app.get('io').of('/room').emit('removeRoom', req.params.id);            
        }, 2000)

    }catch(error){
        console.log(error);
        next(error);
    }
})

router.post('/:id/chat', async (req, res, next) => {
    try{
        const chat = await Chat.create({
            chat: req.body.chat,
            userId: req.user.id,
            chatroomId: req.params.id,            
        })
        
        req.app.get('io').of('/chat').to(req.params.id).emit('chat',{
            chat: req.body.chat,
            userId: req.user.id,
            chatroomId: req.params.id,
            user: req.user   
        });
        res.send('ok');

    }catch(error){
        console.error(error);
        next(error);
    }
})

module.exports = router;