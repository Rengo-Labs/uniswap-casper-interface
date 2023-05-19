import React, {useContext, useEffect, useState} from 'react';
import {SingleColumn} from "../../../layout/SingleColumn";
import {BalanceTable} from "rengo-ui-kit";
import {TokensProviderContext} from "../../../contexts/TokensContext";
import {WalletProviderContext} from "../../../contexts/WalletContext";
import {PairsContextProvider} from "../../../contexts/PairsContext";
import {SUPPORTED_NETWORKS} from "../../../constant";

export const BalanceTemplate = ({isMobile}) => {
    const {isConnected} = useContext(WalletProviderContext)
    const {tokenState, getBalancesProfit, getHistoricalTokenPrices, getHistoricalTokensChartPrices} = useContext(TokensProviderContext)
    const {getGlobalChart} = useContext(PairsContextProvider)
    const [data, setData] = useState([])

    const getBalance = async (tokenState) => {
        return Promise.all(Object.values(tokenState.tokens).map(async (token) => {
          const {symbol, name, amount, logoURI, packageHash}: any = token;
          const data = await getBalancesProfit(packageHash)
          //getHistoricalTokenPrices(packageHash)
          //const result = await getHistoricalTokensChartPrices("hash-0885c63f5f25ec5b6f3b57338fae5849aea5f1a2c96fc61411f2bfc5e432de5a", "hash-28eed3da2b123334c7913d84c4aea0ed426fd268d29410cb12c6bc8a453183f6")
          return (
            {
              contractPackage: symbol === 'CSPR' ? tokenState.tokens['WCSPR'].packageHash.slice(5) : packageHash.slice(5),
              id: symbol,
              crypto: name,
              cryptoIcon: logoURI,
              mycrypto: Number(amount),
              '24h': Number(data.yesterday.toFixed(2)),
              '7d': Number(data.sevenDays.toFixed(2)),
              '15d': Number(data.fifteenDays.toFixed(2)),
              '30d': Number(data.thirtyDays.toFixed(2))
            }
          );
        }))
    }

    useEffect(() => {
      getBalance(tokenState).then(r => {
        getGlobalChart()
        setData(r)
      })
    }, [tokenState, isConnected])

    return (
        <>
            <SingleColumn isMobile={isMobile} title="My Balance">
                <BalanceTable networkLink={`${SUPPORTED_NETWORKS.blockExplorerUrl}/contract-package/`} data={data}/>
            </SingleColumn>
        </>
    );
}
