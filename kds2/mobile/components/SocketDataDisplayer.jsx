import {Button, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
const wayToSocket = "ws://192.168.0.12:8082"

import io from "socket.io-client";
import {TextInput} from "react-native";
import {
    changeResp, clearResp,
    loadMasterKey,
    loadWorkREsp,
    loginResp,
    logoutResp,
    paramsResp, resetResp,
    testResp,
    updateResp
} from "../mocked/answers";
import {getLocation} from "../services/service";



export default function SocketDataDisplayer() {
    let [title, setTitle] = useState("Ожидание команды")
    let [command, setCommand] = useState("________")
    let [TID, setTid] = useState(Math.floor(Math.random()*100000));       //имитация ID терминала

    let socket = io(wayToSocket);


    socket.on("login", msg=>{  //вход в режим администратора
        setTitle("получена команда авторизации")
        setCommand(msg)
        setTimeout(()=>{
            socket.emit("responce", loginResp)
            setTitle("Авторизация завершена. Выслан ответ")
            setCommand(loginResp)
        }, 5000)

        setTimeout(()=>{
            setTitle("Ожидание команды")
            setCommand("")
        }, 10000)
    })

    socket.on("logout", msg=>{  //выхода из режима администратора
        setTitle("получена команда разавторизации")
        setCommand(msg)
        setTimeout(()=>{
            socket.emit("responce", logoutResp)
            setTitle("Выход завершен. Выслан ответ")
            setCommand(logoutResp)
        }, 5000)

        setTimeout(()=>{
            setTitle("Ожидание команды")
            setCommand("")
        }, 10000)
    })


    socket.on("change", msg=>{  //смена пароля
        setTitle("получена команда смены пароля")
        setCommand(msg)
        setTimeout(()=>{
            socket.emit("responce", changeResp)
            setTitle("Смена пароля завершена. Выслан ответ")
            setCommand(changeResp)
        }, 5000)

        setTimeout(()=>{
            setTitle("Ожидание команды")
            setCommand("")
        }, 10000)
    })

    socket.on("update", msg=>{  //смена пароля
        setTitle("получена команда обновления")
        setCommand(msg)
        setTimeout(()=>{
            socket.emit("responce", updateResp)
            setTitle("Обновление завершено. Выслан ответ")
            setCommand(updateResp)
        }, 5000)

        setTimeout(()=>{
            setTitle("Ожидание команды")
            setCommand("")
        }, 10000)
    })

    socket.on("lwk", msg=>{  //смена пароля
        setTitle("получена команда обновления рабочих ключей")
        setCommand(msg)
        setTimeout(()=>{
            socket.emit("responce", loadWorkREsp)
            setTitle("Обновление рабочих ключей завершено. Выслан ответ")
            setCommand(loadWorkREsp)
        }, 5000)

        setTimeout(()=>{
            setTitle("Ожидание команды")
            setCommand("")
        }, 10000)
    })
    socket.on("lmk", msg=>{  //смена пароля
        setTitle("получена команда обновления ключей-хозяев")
        setCommand(msg)
        setTimeout(()=>{
            socket.emit("responce", loadMasterKey)
            setTitle("Обновление ключей-хозяев завершено. Выслан ответ")
            setCommand(loadMasterKey)
        }, 5000)

        setTimeout(()=>{
            setTitle("Ожидание команды")
            setCommand("")
        }, 10000)
    })
    socket.on("test", msg=>{  //смена пароля
        setTitle("Проверка связи")
        setCommand(msg)
        setTimeout(()=>{
            socket.emit("responce", testResp)
            setTitle("Тестирование завершено. Выслан ответ")
            setCommand(testResp)
        }, 5000)

        setTimeout(()=>{
            setTitle("Ожидание команды")
            setCommand("")
        }, 10000)
    })
    socket.on("param", msg=>{  //смена пароля
        setTitle("Запрос параметров")
        setCommand(msg)
        getLocation().then((geo)=>{
            setTimeout(()=>{
                let params_ = JSON.parse(JSON.stringify(params_))
                params_ = params_.replace("mockedGeolocationInformation", geo)
                socket.emit("responce", params_)
                setTitle("Получение параметров заверщено. Выслан ответ")
                setCommand(paramsResp)
            }, 5000)

            setTimeout(()=>{
                setTitle("Ожидание команды")
                setCommand("")
            }, 10000)
        })
    })
    socket.on("clear", msg=>{  //смена пароля
        setTitle("Запрос очистки журнала")
        setCommand(msg)
        setTimeout(()=>{
            socket.emit("responce", clearResp)
            setTitle("Очистка журнала завершена. Выслан ответ")
            setCommand(clearResp)
        }, 5000)

        setTimeout(()=>{
            setTitle("Ожидание команды")
            setCommand("")
        }, 10000)
    })
    socket.on("reset", msg=>{  //смена пароля
        setTitle("Запрос сброса пароля")
        setCommand(msg)
        setTimeout(()=>{
            socket.emit("responce", resetResp)
            setTitle("Сброс пароля завершен. Выслан ответ")
            setCommand(resetResp)
        }, 5000)

        setTimeout(()=>{
            setTitle("Ожидание команды")
            setCommand("")
        }, 10000)
    })



    useEffect(()=>{
        socket.emit("init", JSON.stringify({
            TID: TID,
        }))
    }, [])
    return (
        <View>
            <Text>
                My TID: {TID}
            </Text>
            <Text style = {{
                marginTop: "3%",
                //fontSize: 36      для видеозаписей
            }}>
                {title}
            </Text>
            <Text style = {{
                marginTop: "2%",
                //fontSize: 36      для видеозаписей
            }}>
                {command}
            </Text>
            {/*<Button
                onPress={()=>{
                    socket.emit('init',JSON.stringify({
                        TID: TID,
                    }));
                }}
                title="button test"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />*/}
        </View>
    );
}
