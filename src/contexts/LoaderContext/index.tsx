import {createContext, useState} from "react";
const LoadingContext = createContext({
    loading: true,
    setLoading: (value : boolean) => {},
    timeToShow: 2000,
    setTimeToShow: (value : number) => {}
})
const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [timeToShow, setTimeToShow] = useState(2000);

    return (
        <LoadingContext.Provider value={{
            loading,
            setLoading,
            timeToShow,
            setTimeToShow,
        }}>
            {children}
        </LoadingContext.Provider>
    );
}

export {
    LoadingContext,
    LoadingProvider,
}
