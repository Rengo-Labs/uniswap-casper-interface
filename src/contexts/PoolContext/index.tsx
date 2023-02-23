import React, {createContext, ReactNode, useContext, useState, useMemo, useEffect} from "react";
import {PairsContextProvider} from "../PairsContext";
import PoolResponsibilities from "../../commons/PoolResponsabilities";
import {PairData} from "../../reducers/PairsReducer";
import {Row} from "react-table";

interface poolContextProps {
    previousQuery;
    setCurrentQuery;
    currentQuery;
    setTableInstance;
    tableInstance;
    columns;
    poolColumns?;
    isStaked;
    setStaked: (isStaked) => void;
    changeRowPriority: (name, priority) => void,
    filter: (onlyStaked: boolean, row: Row<PairData>) => any,
    filterDataReload: (row: Row<PairData>) => boolean,
    getTVLandVolume: (pairState: Record<string, PairData>) => any,
    mapExpandedRows: any[],
    setMapExpandedRows: (l) => void,
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
