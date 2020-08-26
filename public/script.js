const socket = io('/')
const videoGrid = document.getElementById('video-grid');
const myVid = document.createElement('video');
myVid.muted = true;
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});


let myVidStrm;
//Getting video and audio for web
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream => {
    myVidStrm = stream;
    addVideoStream(myVid, stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-online', (userId) =>{
        connectToNewUser(userId, stream);
    })
    
})

//joining the room
peer.on('open', id =>{
    //person who is connecting's ID
    //console.log(id);
    socket.emit('join-room', ROOM_ID, id);
})


const connectToNewUser = (userId, stream) =>{
    //Need to Id the new user (use peer2peer)
    //console.log(userId);
    //stream is coming from the promise eventually
    //2nd users stream
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () =>{
        video.play();
    })
    videoGrid.append(video);
}

//for messaging
    let message = $('input');


    //See if the enter(==13) button is clicked
    $('html').keydown((e) =>{
        //see if enter is clicked and its not null
        if (e.which == 13 && message.val().length !== 0){
            console.log(message.val());
            socket.emit('message', message.val());
            message.val('')
        }
    });

    socket.on('createMessage', message =>{
    // console.log('this is from server',message)
    //show message on the message screen
    $('ul').append(`<li class="messages"><b>user</b> ${message}</li>`)
    });