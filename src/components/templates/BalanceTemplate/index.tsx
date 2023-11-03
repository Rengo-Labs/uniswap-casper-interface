import React, {useContext, useEffect, useState} from 'react';
import {SingleColumn} from "../../../layout/SingleColumn";
import {BalanceTable, PlatformBalance} from "rengo-ui-kit";
import {TokensProviderContext} from "../../../contexts/TokensContext";
import {WalletProviderContext} from "../../../contexts/WalletContext";
import {PairsContextProvider} from "../../../contexts/PairsContext";
import {SUPPORTED_NETWORKS} from "../../../constant";
import BigNumber from "bignumber.js";
import {PairData} from "../../../reducers/PairsReducer";

export const BalanceTemplate = ({isMobile}) => {
    const {isConnected} = useContext(WalletProviderContext)
    const {tokenState, getBalancesProfit, getCSTMarket} = useContext(TokensProviderContext)
    const {getPoolList, getTVL} = useContext(PairsContextProvider)
    const [data, setData] = useState([])
    const [tvl, setTVL] = useState('$0.00')
    const [cstMarket, setCSTMarket] = useState('$0.00')

    const getBalance = async (tokenState) => {
        const pairs = getPoolList()

        return Promise.all(Object.values(tokenState.tokens).map(async (token) => {
          const {symbol, name, amount, logoURI, packageHash, priceUSD}: any = token;
          const data = await getBalancesProfit(packageHash)

          return (
            {
              contractPackage: symbol === 'CSPR' ? tokenState.tokens['WCSPR'].packageHash.slice(5) : packageHash.slice(5),
              id: symbol,
              crypto: name,
              cryptoIcon: logoURI,
              marketprice: isNaN(priceUSD) ? 0 : Number(priceUSD).toFixed(4),
              mybalance: (isNaN(amount) || isNaN(priceUSD)) ? 0 : BigNumber(amount * priceUSD).toFixed(2),
              mypools: getAccumulationPool(symbol, priceUSD, pairs),
              mycrypto: amount ? Number(amount) : 0,
              '24h': Number(data.yesterday.toFixed(2)),
              '7d': Number(data.sevenDays.toFixed(2)),
              '15d': Number(data.fifteenDays.toFixed(2)),
              '30d': Number(data.thirtyDays.toFixed(2))
            }
          );
        }))
    }

    const getAccumulationPool = (tokenSymbol, priceUSD, pairList: PairData[]) => {
      const tokenSum = pairList
        .filter(pair => pair.token0Symbol === tokenSymbol || pair.token1Symbol === tokenSymbol)
        .map((pair) => {
          return pair.token0Symbol === tokenSymbol ? parseFloat(pair.reserve0) : parseFloat(pair.reserve1)
        })
        .reduce((accumulator, currentValue) => isNaN(currentValue) ? 0 : accumulator + currentValue, 0)

      return BigNumber(isNaN(priceUSD)?0:priceUSD).times(isNaN(tokenSum) ? 0 : tokenSum).toFixed(2)
    }

    useEffect(() => {
      getBalance(tokenState).then(r => {
        //getGlobalChart()
        setData(r)
      })
      setTVL(getTVL())
      setCSTMarket(getCSTMarket())
    }, [tokenState, isConnected])

    return (
        <>
          <PlatformBalance title='CST Market Cap:' value={cstMarket} paddingTop='10px'/>
          <PlatformBalance title='Total Value Locked:' value={tvl}/>
          <SingleColumn isMobile={isMobile} title="Your Balance">
              <BalanceTable networkLink={`${SUPPORTED_NETWORKS.blockExplorerUrl}/contract-package/`} data={data}/>
          </SingleColumn>
        </>
    );
}
