import {SideBar} from "./SideBar";
import DesktopOnly from "./DesktopOnly";
import React, {useContext} from "react";
import {MobileSideMenuContext} from "../context/MobileSideMenuContextProvider";
import MobileOnly from "./MobileOnly";

let SideMenu = (props)=>{

    let mobileSideMenuContext = useContext(MobileSideMenuContext)
    return <>
        <DesktopOnly isOpen={1}>
            { props.loggedIn &&
            <SideBar/>
            }
        </DesktopOnly>
        <MobileOnly isOpen={mobileSideMenuContext.data.isSideMenuExpanded}>
            { props.loggedIn &&
            <SideBar/>
            }
        </MobileOnly>
    </>
}
export default SideMenu