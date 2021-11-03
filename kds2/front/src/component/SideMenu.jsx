import {SideBar} from "./SideBar";
import DesktopOnly from "./DesktopOnly";
import React, {useContext} from "react";
import {MobileSideMenuContext} from "../context/MobileSideMenuContextProvider";
import MobileOnly from "./MobileOnly";

let SideMenu = (props)=>{

    let hide = ()=>{
        let context_ = JSON.parse(JSON.stringify(mobileSideMenuContext))
        context_.data.isSideMenuExpanded = false
        mobileSideMenuContext.setData(context_.data)
        console.log(mobileSideMenuContext.data)
    }
    let mobileSideMenuContext = useContext(MobileSideMenuContext)
    return <>
        <DesktopOnly isOpen={1}>
            { props.loggedIn &&
            <SideBar/>
            }
        </DesktopOnly>
        <MobileOnly isOpen={mobileSideMenuContext.data.isSideMenuExpanded}>
            <div onClick = {hide}>
                { props.loggedIn &&
                <SideBar/>
                }
            </div>
        </MobileOnly>
    </>
}
export default SideMenu