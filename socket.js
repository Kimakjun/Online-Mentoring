const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
    
    const io = SocketIO(server, {path: '/socket.io'});

    app.set('io', io);
    const room = io.of('/room');
    const chat = io.if('/chat');

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
        const roodId = referer  
            .split('/')[referer.split('/').length - 1]
            .replace(/\?.+/,'');
        socket.join(roomId);           
    })
    

}