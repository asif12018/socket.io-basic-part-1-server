import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http'
import cors from 'cors';
const app = express();
const port = 5000;

app.use(cors(
  {
    origin: ['http://localhost:5173'],
    methods: ["GET", "POST"],
    credentials: true
  }
))

//creating server from http for socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ["GET", "POST"],
    credentials: true
  }
});





app.get('/', (req, res) => {
  res.send('server is running')
})

//connecting to socket.io
io.on('connection', (socket) => {

  // console.log('user connected');
  // console.log('Id', socket.id);
  
  // emit to sent message from server to client
  socket.emit('welcome', 'welcome to the server');
  socket.broadcast.emit(`${socket.id} join the chat`)
  
  //function to get data or text from the client
  socket.on('send-message',(data)=>{
    // console.log(data);
    //sending it to the client
    // socket.broadcast.emit('receive-message', data)
    //to sent the text to specific client by room number
    io.to(data.room).emit('receive-message',data.message)
  })
  //broadcast to sent message from server to client except one user
  socket.broadcast.emit('welcome', `${socket.id} join the server`);

  //socket io disconnect function
  socket.on('disconnect',()=>{
    console.log(`user Disconnected ${socket.id}`)
  })

})



//listening to http server so that it can connect to socket
server.listen(port, () => {
  console.log(`server is running on port ${port}`)
})




