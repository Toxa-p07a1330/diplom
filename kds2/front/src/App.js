import React, { Component } from 'react';
import './App.css';
import { KdsApp } from './component/KdsApp';
import MobileSideMenuContextProvider from "./context/MobileSideMenuContextProvider";

class App extends Component {
  render() {
    return (
        <MobileSideMenuContextProvider>
          <KdsApp/>
        </MobileSideMenuContextProvider>
    );
  }
}

export default App;
