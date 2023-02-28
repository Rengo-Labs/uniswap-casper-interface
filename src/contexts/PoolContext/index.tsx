import React, {createContext, ReactNode, useContext, useState, useMemo, useEffect} from "react";
import {PairsContextProvider} from "../PairsContext";
import PoolResponsibilities from "../../commons/PoolResponsabilities";
import {PairData} from "../../reducers/PairsReducer";
import {Row} from "react-table";
import {TableInstance} from "../../components/organisms/PoolModule";

interface poolContextProps {
    previousQuery: () => void;
    setCurrentQuery;
    currentQuery;
    setTableInstance: (tableInstance) => void;
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
    sortByPriority: (row) => any[]
}

export const PoolProviderContext = createContext<poolContextProps>(null);

export const PoolContext = ({children}: { children: ReactNode }) => {
    const {pairState, pairDispatch, changeRowPriority} = useContext(PairsContextProvider)

    const [isStaked, setStaked] = useState(false)
    const [mapExpandedRows, setMapExpandedRows] = useState([])
    const [currentQuery, setCurrentQuery] = useState("")
    const [tableInstance, setTableInstance] = useState<any>({})
    const { setGlobalFilter } = tableInstance as any as TableInstance<PairData>

    const getColumns = () => PoolResponsibilities(pairState, pairDispatch).getColumns()
    const filter = (isStaked, row) => PoolResponsibilities(pairState, pairDispatch).filter(isStaked, row)
    const filterDataReload = (row) => PoolResponsibilities(pairState, pairDispatch).filterDataReload(currentQuery, row)
    const getTVLandVolume = () => PoolResponsibilities(pairState, pairDispatch).getTVLandVolume(pairState)
    const previousQuery = () => PoolResponsibilities(pairState, pairDispatch).changeData(setGlobalFilter, currentQuery)
    const sortByPriority = (rows) => PoolResponsibilities(pairState, pairDispatch).sortByPriority(rows)


    const columns = getColumns()
    const poolColumns = useMemo(() => columns, []);

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
            setMapExpandedRows,
            sortByPriority
        }}>
            {children}
        </PoolProviderContext.Provider>
    )
}
