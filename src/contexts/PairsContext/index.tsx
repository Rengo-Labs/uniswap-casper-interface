import {ReactNode, useState, createContext, useReducer, useEffect} from "react";
import {initialPairsState, PairsReducer} from "../../reducers/PairsReducer";
import PairsResponsibilities from "../../commons/PairsResponsibilities";

interface PairsContextProps {
    children: ReactNode
}

interface PairsContext {
    pairState: any,
    loadPairs: () => Promise<void>
}

export const PairsContextProvider = createContext<PairsContext>({} as any)

export const PairsContext = ({children} : PairsContextProps) => {
    const [pairState, pairDispatch] = useReducer(
        PairsReducer,
        initialPairsState
    );

    const loadPairs = async (): Promise<void> => {
       await PairsResponsibilities(pairState, pairDispatch).loadPairs()
    }

    return (
        <PairsContextProvider.Provider value={{pairState, loadPairs}}>
            {children}
        </PairsContextProvider.Provider>
    )

}

