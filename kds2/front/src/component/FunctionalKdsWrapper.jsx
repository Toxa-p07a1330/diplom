import React, {useEffect, useState} from "react";
let FunctionalKdsWrapper = (props)=>{
    const [isBlocked, setBlocked] = useState(false)
    useEffect(()=>{
        (
            async ()=>{
                let response = await fetch("https://alg.justdoluck.ru/api/get-UTC-time")
                let json = await response.json()
                let currentServerTimeStsmp = new Date(json.time).getTime()
                let currentDeviceTimeStamp = new Date().getTime()
                if (Math.abs(currentDeviceTimeStamp - currentServerTimeStsmp)>86400000){
                    alert("Время на устройстве выставлено совсем некорректно. Доступ к прилоэению заблокирован")
                    setBlocked(true)
                }
                return;
                if (Math.abs(currentDeviceTimeStamp - currentServerTimeStsmp)>600000){
                    alert("Время на устройстве выставлено некорректно. Приложение может работаать со сбоями")
                }


            })()
    })
    if (isBlocked)
        return <div>
            Доступ запрещен. Пожалуййста, скорректируйте настройки времени
        </div>
    return <div>
        {(
            ()=>{
                window.lastVisitedPage = window.location.pathname;
            }
        )()}
        {props.children}
    </div>
}
export default FunctionalKdsWrapper