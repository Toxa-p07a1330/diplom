import React, { useState } from 'react';

const LangSelectorContext = React.createContext();
let LangSelectorContextProvider = props => {

    let language = window.navigator ? (window.navigator.language ||
        window.navigator.systemLanguage ||
        window.navigator.userLanguage): "ru"
    language = language.substr(0, 2).toLowerCase();
    const [state, setState] = useState({
        lang: language
    });
    return (
        <LangSelectorContext.Provider value={{ data: state, setData: setState }}>
            {props.children}
        </LangSelectorContext.Provider>
    );
};
export default LangSelectorContextProvider;
export { LangSelectorContext };
