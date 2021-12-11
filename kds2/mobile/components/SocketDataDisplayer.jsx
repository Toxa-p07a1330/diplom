import {Button, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
const wayToSocket = "ws://192.168.0.12:8082"

import io from "socket.io-client";
import {TextInput} from "react-native";

export default function SocketDataDisplayer() {
    let [title, setTitle] = useState("Ожидание команды")
    let [command, setCommand] = useState("________")
    let [TID, setTid] = useState(Math.floor(Math.random()*100000));       //имитация ID терминала

    let socket = io(wayToSocket);


    socket.on("login", msg=>{  //вход в режим администратора
        setTitle("получена команда авторизации")
        setCommand(msg)
        setTimeout(()=>{
            setTitle("Авторизация завершена. Выслан ответ")
            setCommand("" +
                "<login>\n" +
                "<status>ok</status>\n" +
                "<token>DE9773A8CB888560AB0F89C07623FE03</token>\n" +
                "</login>" +
                "")
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
