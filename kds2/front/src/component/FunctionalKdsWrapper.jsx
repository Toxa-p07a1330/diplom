import {useContext, useEffect, useState} from "react";
import {PageVisitedBeforeLoginContext} from "../context/PageVisitedBeforeLoginContext";
import React from "react";
let FunctionalKdsWrapper = (props)=>{
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