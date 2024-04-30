import {Server} from 'socket.io';
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename=fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT =process.env.PORT || 3000;

const app=express();

app.use(express.static(path.join(__dirname,'public')));


const expressServer = app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
});

const io=new Server(expressServer,{
    cors:{
        origin:process.env.NODE_ENV === "production" ? false : ["http://localhost:3000",
        "http://127.0.0.1:3001"],
    }
})

io.on('connection',socket=>{

    console.log(`User ${socket.id} connected`);

    //upon connection -only to user
    socket.emit('message',"Welcome to chat App!")

    ////upon connection - to all others
    socket.broadcast.emit("message",`a new user ${socket.id.substring(0,5)} has joined!`);

    // Listening for a message event 
    socket.on('message', data => {
        console.log(data);
        io.emit('message', `${socket.id.substring(0, 5)}: ${data}`);
    });

    //when user disconnects - to all others
    socket.on('disconnect', () => {
        socket.broadcast.emit("message",` User ${socket.id.substring(0,5)} disconnected!`);
    })

    //listen for activity
    socket.on('activity',(name)=>{
        socket.broadcast.emit('activity',name)
    })
})

