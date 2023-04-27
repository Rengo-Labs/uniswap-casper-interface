import React, {useContext, useEffect, useState} from 'react';
import {SingleColumn} from "../../../layout/SingleColumn";
import {BalanceTable} from "rengo-ui-kit";
import {TokensProviderContext} from "../../../contexts/TokensContext";
import {WalletProviderContext} from "../../../contexts/WalletContext";

export const BalanceTemplate = ({isMobile}) => {
    const {isConnected} = useContext(WalletProviderContext)
    const {tokenState} = useContext(TokensProviderContext)

    const getBalance = (tokenState) => {
        return Object.values(tokenState.tokens).map((token) => {
            const {symbol, name, amount, logoURI}: any = token;
            return (
              {
                  id: symbol,
                  crypto: name,
                  cryptoIcon: logoURI,
                  mycrypto: amount,
                  '24h': '0.00%',
                  '7d': '0.00%',
                  '15d': '0.00%',
                  '30d': '0.00%'
              }
            );
        })
    }
    const [data, setData] = useState([])

    useEffect(() => {
      const list = getBalance(tokenState)
      setData(list)
      console.log(data)
    }, [tokenState, isConnected])

    return (
        <div>
            <SingleColumn isMobile={isMobile} title="My Balance">
                <BalanceTable data={data}/>
            </SingleColumn>
        </div>
    );
}
