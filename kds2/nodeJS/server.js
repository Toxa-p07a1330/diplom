const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "kds",
    password: "swzYW92W"
});
connection.connect(function(err){
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else{
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

connection.execute("SELECT * FROM users",
    function(err, results, fields) {
        console.log(results); // собственно данные
    });
connection.end();