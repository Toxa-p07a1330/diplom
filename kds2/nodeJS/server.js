const mysql = require("mysql2");
const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');


const connection = mysql.createConnection({     //настройки покключения
    host: "localhost",
    user: "root",
    database: "kds",
    password: "swzYW92W"
});
connection.connect(function(err){       //подключение к базе данных
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else{
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.options('*', cors());
app.listen(8081);   //настройки сокета



app.post("/api/log", function(request, response){
    console.log(request.body)
    try {
        writeNewLogToDatabase(request.body.date, request.body.level, request.body.user, request.body.message, response)
    }
    catch (e){
        console.log(e);
        response.send(JSON.stringify(e));
    }
});


let writeNewLogToDatabase = async (date, level, user, message, responce)=>{             //запись нового лога в БД
    let sqlStr = "INSERT INTO logs (date, level, user, message) values" +
        "('"+date+"', '"+level+"', '"+user+"', '"+message+"')";
    console.log(sqlStr)
    connection.execute(sqlStr,
        function(err, results, fields) {
            if (err){
                responce.send(JSON.stringify(err))
            }
            else {
                responce.send(results)
            }
        });

}



