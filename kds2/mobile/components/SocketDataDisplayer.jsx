import {Button, Text, View} from "react-native";
import React, {useEffect, useState} from "react";

const wayToSocket = "ws://192.168.0.12:8082"

import io from "socket.io-client";
import {TextInput} from "react-native";

export default function SocketDataDisplayer() {
    let [state, setState] = useState("start")
    const TID = 863145;

    let socket = io(wayToSocket);
    socket.on("message", msg => {
        console.log(msg)
        setState(msg);
    });

    useEffect(()=>{
        socket.emit("init", JSON.stringify({
            TID: TID,
        }))
    }, [])
    return (
        <View>
            <Text>
                {state}
            </Text>

            <Button
                onPress={()=>{
                    socket.emit('init',JSON.stringify({
                        TID: TID,
                    }));
                }}
                title="button test"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
        </View>
    );
}
