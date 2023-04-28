import React, {useContext, useEffect, useState} from 'react';
import {SingleColumn} from "../../../layout/SingleColumn";
import {BalanceTable} from "rengo-ui-kit";
import {TokensProviderContext} from "../../../contexts/TokensContext";
import {WalletProviderContext} from "../../../contexts/WalletContext";

export const BalanceTemplate = ({isMobile}) => {
    const {isConnected} = useContext(WalletProviderContext)
    const {tokenState, getBalancesProfit} = useContext(TokensProviderContext)
    const [data, setData] = useState([])

    const getBalance = async (tokenState) => {
        return Promise.all(Object.values(tokenState.tokens).map(async (token) => {
          const {symbol, name, amount, logoURI, packageHash}: any = token;
          const data = await getBalancesProfit(packageHash)

          return (
            {
              id: symbol,
              crypto: name,
              cryptoIcon: logoURI,
              mycrypto: amount,
              '24h': data.yesterday.toFixed(2) + " %",
              '7d': data.sevenDays.toFixed(2) + " %",
              '15d': data.fifteenDays.toFixed(2) + " %",
              '30d': data.thirtyDays.toFixed(2) + " %"
            }
          );
        }))
    }

    useEffect(() => {
      getBalance(tokenState).then(r => {
        setData(r)
        console.log(r)
      })
      console.log(data)
    }, [tokenState, isConnected])

    return (
        <>
            <SingleColumn isMobile={isMobile} title="My Balance">
                <BalanceTable data={data}/>
            </SingleColumn>
        </>
    );
}
