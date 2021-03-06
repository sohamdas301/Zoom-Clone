const express = require('express');
const app = express();
// const path = require('path');
const cors = require("cors");
const server = require('http').Server(app);
const port = process.env.PORT || 8000;
const io = require('socket.io')(server,{
    cors : {
        origin : '*',
    }
});
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
const { v4: uuidv4 } = require('uuid');

app.use([
    cors(),
  ]);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);
// app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        // console.log(userId);
        socket.join(roomId);
        socket.broadcast.emit('user-connected', userId);
        socket.on('message',(message)=>{
            io.to(roomId).emit('message',message);
        })
    })
})

server.listen(port);
// https://video00chat.herokuapp.com/ 
//////////////////////////////////////////////////


// const express = require('express')
// const app = express()
// // const cors = require('cors')
// // app.use(cors())
// const server = require('http').Server(app)
// const io = require('socket.io')(server)
// const { ExpressPeerServer } = require('peer');
// const peerServer = ExpressPeerServer(server, {
//   debug: true
// });
// const { v4: uuidV4 } = require('uuid')

// app.use('/peerjs', peerServer);

// app.set('view engine', 'ejs')
// app.use(express.static('public'))

// app.get('/', (req, res) => {
//   res.redirect(`/${uuidV4()}`)
// })

// app.get('/:room', (req, res) => {
//   res.render('room', { roomId: req.params.room })
// })

// io.on('connection', socket => {
//   socket.on('join-room', (roomId, userId) => {
//     socket.join(roomId)
//     socket.to(roomId).broadcast.emit('user-connected', userId);
//     // messages
//     socket.on('message', (message) => {
//       //send message to the same room
//       io.to(roomId).emit('createMessage', message)
//   }); 

//     socket.on('disconnect', () => {
//       socket.to(roomId).broadcast.emit('user-disconnected', userId)
//     })
//   })
// })

// server.listen(process.env.PORT||3030)