const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const port = 8082
const io = new Server(server);
const TID_connections = []

let find_TID = (TID)=>{
    let rez = TID_connections.filter((value)=>{
        return value.TID === TID
    })
    return !!(rez.length);
}

io.listen(port);
io.on("connection", socket => {
    console.log("Device connected");
    socket.on("init", (data) => {
        console.log("Init")
        let id = socket.id;
        let TID = JSON.parse(data).TID;
        if (!find_TID(TID)){
            TID_connections.push({
                connection_id: id,
                TID: TID
            });
            console.log(TID_connections);
        }
    });
});


const expressPort = 8083;
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(expressPort)
