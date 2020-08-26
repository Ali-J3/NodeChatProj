//initializing the App
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
app.set('view engine', 'ejs');
app.use(express.static('public'));


//First URL
app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.use('/peerjs', peerServer);

app.get('/:room', (req, res) => {
    res.render('room', {roomID: req.params.room})
})



io.on('connection', socket =>{
    socket.on('join-room', (roomID, userId) =>{
        //UserID will tell us which user is connected
        socket.join(roomID);
        socket.to(roomID).broadcast.emit('user-online', userId);
        //console.log("room joined");

        //When user is connected view the message
        //send the message the the connected roomID
        socket.on('message', message =>{
            io.to(roomID).emit('createMessage', message)
        })
    })
})


//listening to port
server.listen(3030);