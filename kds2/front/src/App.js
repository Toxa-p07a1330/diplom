import React, { Component } from 'react';
import './App.css';
import { KdsApp } from './component/KdsApp';
import MobileSideMenuContextProvider from "./context/MobileSideMenuContextProvider";
import FunctionalKdsWrapper from "./component/FunctionalKdsWrapper";
import GlobalContextProvider from "./context/GlobalContextProvider";

class App extends Component {
  render() {
    return (
        <MobileSideMenuContextProvider>
            <GlobalContextProvider>
                <FunctionalKdsWrapper>
                    <KdsApp/>
                </FunctionalKdsWrapper>
            </GlobalContextProvider>
        </MobileSideMenuContextProvider>
    );
  }
}

export default App;
