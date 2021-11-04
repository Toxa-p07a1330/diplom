import React, { useState } from 'react';

const LangSelectorContext = React.createContext();
let LangSelectorContextProvider = props => {
    const [state, setState] = useState({
        lang: "en"
    });
    return (
        <LangSelectorContext.Provider value={{ data: state, setData: setState }}>
            {props.children}
        </LangSelectorContext.Provider>
    );
};
export default LangSelectorContextProvider;
export { LangSelectorContext };
