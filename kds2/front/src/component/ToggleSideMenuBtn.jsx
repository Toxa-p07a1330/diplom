import hamburger from "../static/hamburger.png";
import cross from "../static/cross.png"
import React, {useContext} from "react";
import {MobileSideMenuContext} from "../context/MobileSideMenuContextProvider";
let ToggleSideMenuBtn = ()=>{

    let mobileSideMenuContext = useContext(MobileSideMenuContext)
    return <>
        <div>
            {
                mobileSideMenuContext.data.isSideMenuExpanded?
                    <>
                        <img src={cross} style={{
                            width: "50px",
                            height: "30px",
                            cursor: "pointer"
                        }}
                             onClick={()=>{
                                 let context_ = JSON.parse(JSON.stringify(mobileSideMenuContext))
                                 context_.data.isSideMenuExpanded = !context_.data.isSideMenuExpanded
                                 mobileSideMenuContext.setData(context_.data)
                                 console.log(mobileSideMenuContext.data)
                             }}/>
                    </>:
                    <>
                        <img src={hamburger} style={{
                            width: "50px",
                            height: "30px",
                            cursor: "pointer"
                        }}
                             onClick={()=>{
                                 let context_ = JSON.parse(JSON.stringify(mobileSideMenuContext))
                                 context_.data.isSideMenuExpanded = !context_.data.isSideMenuExpanded
                                 mobileSideMenuContext.setData(context_.data)
                                 console.log(mobileSideMenuContext.data)
                             }}/>
                    </>
            }
        </div>

    </>
}
export default ToggleSideMenuBtn