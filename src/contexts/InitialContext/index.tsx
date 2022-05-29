import React, { createContext, ReactNode } from 'react'

export const InitialProviderContext = createContext<any>({})

export function InitialContext({ children }: { children: ReactNode }) {
  const InfoBoxArray = [
    { infoBoxTitle: '$ 3.81', infoBoxSmall: '$CSPR Price' },
    { infoBoxTitle: '$ 2.04b', infoBoxSmall: 'Total Liquidity' },
    { infoBoxTitle: '$ 171.15b', infoBoxSmall: 'Total Volume' },
    { infoBoxTitle: '2,601', infoBoxSmall: 'Total Pairs' }
  ]

  const initialState = { InfoBoxArray }
  return (
    <InitialProviderContext.Provider value={initialState} >
      {children}
    </InitialProviderContext.Provider>
  )
}
