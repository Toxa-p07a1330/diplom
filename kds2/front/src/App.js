import React, { Component } from 'react';
import './App.css';
import { KdsApp } from './component/KdsApp';
import MobileSideMenuContextProvider from "./context/MobileSideMenuContextProvider";
import FunctionalKdsWrapper from "./component/FunctionalKdsWrapper";
import LangSelectorContextProvider from "./context/LangSelectorContextProvider";

class App extends Component {
  render() {
    return (
        <MobileSideMenuContextProvider>
            <LangSelectorContextProvider>
                <FunctionalKdsWrapper>
                    <KdsApp/>
                </FunctionalKdsWrapper>
            </LangSelectorContextProvider>
        </MobileSideMenuContextProvider>
    );
  }
}

export default App;
