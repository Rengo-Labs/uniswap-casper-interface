import React, {createContext, ReactNode, useContext, useState, useMemo, useEffect} from "react";
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

export const PoolContext = ({children}: { children: ReactNode }) => {
    const {pairState, pairDispatch} = useContext(PairsContextProvider)

    const [currentQuery, setCurrentQuery] = useState("")
    const [tableInstance, setTableInstance] = useState<any>({})
    const instance = PoolResponsibilities(pairState, pairDispatch, currentQuery, tableInstance)

    const {
        getColumns,
        changeRowPriority,
        filter,
        changeData,
        filterDataReload,
        getTVLandVolume,
    } = instance

    const columns = getColumns()
    const poolColumns = useMemo(() => columns, []);
    const [isStaked, setStaked] = useState(false)
    const [mapExpandedRows, setMapExpandedRows] = useState([])
    const previousQuery = () => changeData(currentQuery)

    return (
        <PoolProviderContext.Provider value={{
            previousQuery,
            currentQuery,
            setCurrentQuery,
            setTableInstance,
            tableInstance,
            columns,
            poolColumns,
            isStaked,
            setStaked,
            // ordered and filtered data
            changeRowPriority,
            filter,
            filterDataReload,
            getTVLandVolume,
            mapExpandedRows,
            setMapExpandedRows
        }}>
            {children}
        </PoolProviderContext.Provider>
    )
}
