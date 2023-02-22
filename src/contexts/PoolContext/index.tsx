import {createContext, ReactNode, useContext, useState} from "react";
import {PairsContextProvider} from "../PairsContext";
import PoolResponsibilities from "../../commons/PoolResponsabilities";

interface poolContextProps {
    previousQuery;
    setCurrentQuery;
    currentQuery;
    setTableInstance;
    tableInstance;
    instance;
}
export const PoolProviderContext = createContext<poolContextProps>(null);

export const PoolContext = ({ children }: { children: ReactNode }) => {
    const {pairState} = useContext(PairsContextProvider)
    const [currentQuery, setCurrentQuery] = useState("")
    const [tableInstance, setTableInstance] = useState<any>({})
    const instance = PoolResponsibilities(pairState, currentQuery, tableInstance)

    const previousQuery = () => {
        instance.changeData(currentQuery)
    }

    return (
        <PoolProviderContext.Provider value={{previousQuery, currentQuery, setCurrentQuery, setTableInstance, tableInstance, instance}}>
            {children}
        </PoolProviderContext.Provider>
    )
}
