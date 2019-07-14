const express=require('express')
const app=express();
const socket=require('socket.io')
const http=require('http')
const server=http.createServer(app)
const io=socket(server)
const Sequelize=require('sequelize')

let pair=[];

const sequelize=new Sequelize('testdb','reet','reet',{
    dialect:'sqlite',
    storage:"./db",
})

let ChatRoom=sequelize.define('chatroom',
{
    ID:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username:
    {
        type:Sequelize.STRING
    },
    message:
    {
        type:Sequelize.STRING
    }
})

io.on('connection',(socket)=>
{
    socket.on('username',(data)=>
    {
        ChatRoom.findAll().then((data)=>
        {
            let reducedData = data.reduce((accum,item)=>
                {
                    return accum+ `<li>${item.username}:${item.message}</li>`
        
                }," ")

                console.log(reducedData)
            socket.emit('all',{
                all: reducedData
            })
        })

          let newObj={
            userName:data.username,
            socketID:socket.id
        }
        pair.push(newObj)
       
    })

    socket.on('message',(data)=>
    {
        let obj=pair.find((data)=>
        {
            return data.socketID==socket.id
        })
        let newObj={
            username:obj.userName,
            message:data.message
        }
        ChatRoom.create(newObj).then(()=>{})

        ChatRoom.findAll().then((data)=>
        {
            
            io.emit('all',{
                all:data.reduce((accum,item)=>
                {
                    // console.log(item.username)
                    // console.log(item.message)
                    return accum+ `<li>${item.username}:${item.message}</li>`
        
                }," ")
            })
        })
    })
})


app.use('/',express.static(__dirname+'/public'))


ChatRoom.sync().then(()=>
{
server.listen(4040,()=>
{
    console.log("Server Running on: http://127.0.0.1:4040")
})
})