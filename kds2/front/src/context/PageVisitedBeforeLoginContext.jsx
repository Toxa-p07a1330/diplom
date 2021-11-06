import React, { useState } from 'react';

const PageVisitedBeforeLoginContext = React.createContext();
let PageVisitedBeforeLoginContextProvider = props => {
    const [state, setState] = useState({
        history: []
    });
    return (
        <PageVisitedBeforeLoginContext.Provider value={{ data: state, setData: setState }}>
            {props.children}
        </PageVisitedBeforeLoginContext.Provider>
    );
};
export default PageVisitedBeforeLoginContextProvider;
export { PageVisitedBeforeLoginContext };
