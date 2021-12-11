import {Button, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
const wayToSocket = "ws://192.168.0.12:8082"

import io from "socket.io-client";
import {TextInput} from "react-native";

const loginResp = "" +
    "<login>\n" +
    "<status>ok</status>\n" +
    "<token>DE9773A8CB888560AB0F89C07623FE03</token>\n" +
    "</login>" +
    ""

const logoutResp = '<logout>\n' +
    '<status>ok</status>\n' +
    '</logout>'

const changeResp = '<changepassword>\n' +
    '<status>ok</status>\n' +
    '</changepassword>'

const updateResp = '<updateconfiguration>\n' +
    '<status>ok</status>\n' +
    '</updateconfiguration>'
const loadWorkREsp = '<loadworkkeys>\n' +
    '<status>ok</status>\n' +
    '<mac-change-receipt>\n' +
    '<rrn>123456789123</rrn>\n' +
    '</mac-change-receipt>\n' +
    '<net-change-receipt>\n' +
    '<rrn>023456789120</rrn>\n' +
    '</net-change-receipt>\n' +
    '</loadworkkeys>'

const loadMasterKey = '<loadmasterkeys>\n' +
    '<status>ok</status>\n' +
    '<receipt><pkcv>123456</pkcv><mkcv>789ABC</mkcv></receipt>\n' +
    '</loadmasterkeys>'
const testResp = "<testconnection>\n" +
    "<status>ok</status>\n" +
    "</testconnection>"

const paramsResp = '<getparameters>\n' +
    '<status>ok</status>\n' +
    '<parameters>\n' +
    '<sn>000000000009</sn>\n' +
    '<app>1.0.67.6</app>\n' +
    '<firmware-mcu>1.5.3</firmware-mcu>\n' +
    '<firmware-boot>2.0.1</firmware-boot>\n' +
    '<os>CS10_V1.07_181127PK</os>\n' +
    '<sdk>1.0.4</sdk>\n' +
    '<tid>1000000001</tid>\n' +
    '<mid>243423434122313</mid>\n' +
    '<tconf>19-04-01.01</tconf>\n' +
    '<ntconf>cname</ntconf>\n' +
    '<cconf>18-10-25.06</cconf>\n' +
    '<ncconf>cname_test</ncconf>\n' +
    '<econf>19-04-13.02</econf>\n' +
    '<neconf>2can_jibe_emv</neconf>\n' +
    '<kconf>18-08-30.04</kconf>\n' +
    '<nkconf>combined_ca_database</nkconf>\n' +
    '<acqid>twocan</acqid>\n' +
    '<cccert>24.03.2027</cccert>\n' +
    '<csca>20.11.2037</csca>\n' +
    '<cshost>192.168.0.185</cshost>\n' +
    '<accert>24.03.2027</accert>\n' +
    '<asca>12.10.2020</asca>\n' +
    '<ashost>192.168.0.2</ashost>\n' +
    '<kccert>24.03.2027</kccert>\n' +
    '<ksca>none</ksca>\n' +
    '<devid>M2100-0000005164</devid>\n' +
    '</parameters>\n' +
    '</getparameters>'
const clearResp = '<clear>\n' +
    '<status>ok</status>\n' +
    '<sreport>\n' +
    '<resp-code>000</resp-code>\n' +
    '<approval-number>ASD002</approval-number>\n' +
    '<rrn>837495759322</rrn>\n' +
    '<orig-amount>D003030001000</orig-amount>\n' +
    '<amount>D003030001000</amount>\n' +
    '<datetime>180322102354</datetime>\n' +
    '<tid>1000000001</tid>\n' +
    '<mid>123456789012345</mid>\n' +
    '</sreport>\n' +
    '</clear>'
const resetResp = '<resetpassword>\n' +
    '<status>ok</status>\n' +
    '</resetpassword>'

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
        setTimeout(()=>{
            socket.emit("responce", paramsResp)
            setTitle("Получение параметров заверщено. Выслан ответ")
            setCommand(paramsResp)
        }, 5000)

        setTimeout(()=>{
            setTitle("Ожидание команды")
            setCommand("")
        }, 10000)
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
                marginTop: "3%"
            }}>
                {title}
            </Text>
            <Text style = {{
                marginTop: "2%"
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
