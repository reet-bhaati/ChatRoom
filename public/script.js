let socket= io();
$(()=>
{
    const messageBox=$('#messageBox')
    const add=$('#add')
    const inputBox=$('#inputBox')
    const send=$('#send')
    const inputDiv=$('#inputDiv')
    const messageDiv=$('#messageDiv')
    const messageList=$('#messageList')

    messageDiv.hide()
    add.click(()=>
    {   
        inputDiv.hide()
        messageDiv.show()
        socket.emit('username',{
            username:inputBox.val()
        })
    })

    send.click(()=>
    {
        socket.emit('message',{
            message:messageBox.val()
        })
    })

    socket.on('all',(data)=>
    {  
        messageList.empty() 
        messageList.append(data.all)
    })

})