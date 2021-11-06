import React, { Component } from 'react';
import './App.css';
import { KdsApp } from './component/KdsApp';
import MobileSideMenuContextProvider from "./context/MobileSideMenuContextProvider";
import FunctionalKdsWrapper from "./component/FunctionalKdsWrapper";
import LangSelectorContextProvider from "./context/LangSelectorContextProvider";
import PageVisitedBeforeLoginContextProvider from "./context/PageVisitedBeforeLoginContext";

class App extends Component {
  render() {
    return (
        <MobileSideMenuContextProvider>
            <LangSelectorContextProvider>
                <PageVisitedBeforeLoginContextProvider>
                <FunctionalKdsWrapper>
                        <KdsApp/>
                </FunctionalKdsWrapper>
            </PageVisitedBeforeLoginContextProvider>
            </LangSelectorContextProvider>
        </MobileSideMenuContextProvider>
    );
  }
}

export default App;
