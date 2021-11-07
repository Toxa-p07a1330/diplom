import React, { useState } from 'react';

const LangSelectorContext = React.createContext();
let GlobalContextProvider = props => {

    let language = window.navigator ? (window.navigator.language ||
        window.navigator.systemLanguage ||
        window.navigator.userLanguage): "ru"
    language = language.substr(0, 2).toLowerCase();
    if (language !== "ru" || language !== "en")
        language="ru"
    const [state, setState] = useState({
        lang: language,
        way_to_logging_backend: "http://localhost:8081/api/log"
    });
    return (
        <LangSelectorContext.Provider value={{ data: state, setData: setState }}>
            {props.children}
        </LangSelectorContext.Provider>
    );
};
export default GlobalContextProvider;
export { LangSelectorContext };
