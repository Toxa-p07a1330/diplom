const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const url = require('url');
const querystring = require('querystring');

const port = 8082
const io = new Server(server);
let TID_connections = []

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
                socket: socket,
                TID: TID,
                id: socket.id
            });
        }
    });

    socket.on("disconnect", (reason) => {
        console.log("Device disconnected");
        TID_connections = TID_connections.filter((value)=>{
            return value.id !== socket.id;
        })
    });
});

let getQueryParams = (search) => {
    let params = {};
    let key_value_array = search.substring(1).split('&');
    key_value_array.map((value, index, array) => {
        let key = value.split('=')[0];
        let val = value.split('=')[1];
        params[key] = val;
    });
    return params;
};


const expressPort = 8083;
app.get('*/sendCommand', (req, res) => {
    let params = url.parse(req.url);
    let parsedUrl = url.parse(req.url);
    let parsedQs = querystring.parse(parsedUrl.query);

    /*console.log(parsedQs)
    console.log("TID")
    console.log(parsedQs.TID);
    console.log(TID_connections.map((value)=>{
        return {
            id: value.id,
            TID: value.TID
        }
    }))*/
    let socket = TID_connections.filter((value)=>{return value.TID == parsedQs.TID})[0].socket;
    socket.emit("update", "some msg");

    res.send('Hello World!')
})
app.listen(expressPort)
