import React, {useEffect, useState} from "react";
let DesktopOnly = ()=>{
    const keyWidth = 500
    const [isDesktop, setDesktop] = useState()
    let isOpen = props.isOpen
    useEffect(()=>{
        window.addEventListener("resize", ()=>{
            setDesktop(window.innerWidth>keyWidth)
        })
    }, [])
    if (isOpen && isDesktop)
        return <>
            {props.children}
        </>
    return <div/>
}

export default DesktopOnly