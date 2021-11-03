import React, { useState } from 'react';

const MobileSideMenuContext = React.createContext();
let MobileSideMenuContextProvider = props => {
    const [state, setState] = useState({
        isSideMenuExpanded: false
    });
    return (
        <MobileSideMenuContext.Provider value={{ data: state, setData: setState }}>
            {props.children}
        </MobileSideMenuContext.Provider>
    );
};
export default MobileSideMenuContextProvider;
export { MobileSideMenuContext };
