const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const url = require('url');
const querystring = require('querystring');
const cors = require('cors');

app.use(cors());
app.options('*', cors());

const port = 8082
const io = new Server(server);
let TID_connections = []

const commandMessageMapping = {
    "login": "<login>\n" +
        "<password>12345678</password>\n" +
        "</login>",
    "logount": "<logout>\n" +
        "<token>DE9773A8CB888560AB0F89C07623FE03</token>\n" +
        "</logout>",
    'change': "<changepassword>\n" +
        "<token>DE9773A8CB888560AB0F89C07623FE03</token>\n" +
        "<password>12345678</password>\n" +
        "<newpassword>12345678</newpassword>\n" +
        "</changepassword>",
    'update': '<updateconfiguration>\n' +
        '<token>DE9773A8CB888560AB0F89C07623FE03</token>\n' +
        '</updateconfiguration>',
    'lwk':"<loadworkkeys>\n" +
        "<token>DE9773A8CB888560AB0F89C07623FE03</token>\n" +
        "</loadworkkeys>",
    'lmk':"<loadmasterkeys>\n" +
        "<token>DE9773A8CB888560AB0F89C07623FE03</token>\n" +
        "</loadmasterkeys>",
    'test': "<testconnection>\n" +
        "<token>DE9773A8CB888560AB0F89C07623FE03</token>\n" +
        "</testconnection>",
    'param': "<getparameters>\n" +
        "<token>DE9773A8CB888560AB0F89C07623FE03</token>\n" +
        "8\n" +
        "</getparameters>",
    'clear':'<clear>\n' +
        '<password>12345678</password>\n' +
        '</clear>',
    'reset':'<resetpassword/>'
}

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


    let socket = TID_connections.filter((value)=>{return value.TID == parsedQs.TID})[0].socket;
    socket.emit(parsedQs.command, commandMessageMapping[parsedQs.command]);
    socket.on("responce", (msg)=>{
        res.send(msg);
        res.send = ()=>{}
    })

})
app.listen(expressPort)
