const socket=io('ws://localhost:3000');

const activity=document.querySelector(".activity");
const msgInput=document.querySelector('input')

function sendMessage(e){
    e.preventDefault()
    if(msgInput.value){
        socket.emit('message',msgInput.value)
        msgInput.value=""
    }
    msgInput.focus()
}

document.querySelector("form").addEventListener("submit",sendMessage);

socket.on("message",(data)=>{
    activity.textContent=""
    const li =document.createElement('li')
    li.textContent=data
    document.querySelector('ul').appendChild(li)
})

msgInput.addEventListener("keypress",()=>{
    socket.emit("activity",socket.id.toString(0,5))
})
let activityTimer;

//whenever there is an event called "activity" from server

socket.on("activity",(name)=>{
    activity.textContent= `${name} is typing..`

    //clear after 3 secs
    clearTimeout(activityTimer);
    activityTimer=setTimeout(() => {
        activity.textContent=""
    },1000)
})