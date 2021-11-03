import React, {useEffect, useState} from "react";
let MobileOnly = (props)=>{
    const keyWidth = 500
    const [isMobile, setMobile] = useState()
    let isOpen = props.isOpen
    useEffect(()=>{
        window.addEventListener("resize", ()=>{
            setMobile(window.innerWidth<keyWidth)
        })
    }, [])
    if (isOpen && isMobile)
        return <>
            {props.children}
        </>
    return <div/>

}
export default MobileOnly