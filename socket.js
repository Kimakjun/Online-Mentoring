const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
    
    const io = SocketIO(server, {path: '/socket.io'});

    app.set('io', io);
    const room = io.of('/room');
    const chat = io.of('/chat');

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    })

    room.on('connection', (socket) => {
        console.log('room 네임 스페이스에 접속');
        socket.on('disconnect', () => {
            console.log('room 네이스페이스 접속 해제');
        })
    })

    chat.on('connection', (socket) => {
        console.log('chat 네임스페이스에 접속');
        const req = socket.request;
        
        const { headers : {referer} } = req;
        const roomId = referer  
            .split('/')[referer.split('/').length - 1]
            .replace(/\?.+/,'');
        socket.join(roomId);   
        
        socket.to(roomId).emit('join', {
            user: 'system',
            chat: `${req.session.nick} 님이 입장하셨습니다.`,
        })

        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제');
            socket.leave(roomId);
            const currentRoom = socket.adapter.rooms[roomId];
            const userCount = currentRoom ? currentRoom.length : 0;
            console.log(userCount);
            if(userCount == 0){
                axios.delete(`http://35.233.231.215/room/${roomId}`)
                    .then(() => {
                        console.log('방제거 요청 성공');
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }else{
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${req.session.nick}님이 퇴장하셨습니다.`,
                })
            }
        })

    })

}