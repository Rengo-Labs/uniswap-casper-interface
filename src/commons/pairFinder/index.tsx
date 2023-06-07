
import { convertUIStringToBigNumber } from "../utils";
import BigNumber from "bignumber.js";
import { PairState } from "../../reducers/PairsReducer";
import { PairReserves } from "../../contexts/ConfigContext";
import { TokenState } from "../../reducers/TokenReducers";
import { getPath } from "../calculations";
import { NotificationType } from "../../constant";
import { PairTotalReserves } from "../PairsResponsibilities";

export const pairFinder = (pairState: PairState, tokenState?: TokenState) => {

    const orderedPairState = () : Record<string, PairTotalReserves> => {
        const orderedPairs: Record<string, PairTotalReserves> = {}
        Object.values(pairState).map((pl) => {
            orderedPairs[pl.orderedName] = pl
        })
        return orderedPairs
    }

    /**
     * findReservesBySymbols search for pair data by the symbol pair
     *
     * @param tokenSymbol token symbol string
     *
     * @returns usd conversion rate
     */
    const findUSDRateBySymbol = (
      tokenSymbol: string,
      pairTotalReserves: Record<string, PairTotalReserves>,
      updateNotification
    ): BigNumber => {
        let t = tokenSymbol
        if (t === 'CSPR') {
            t = 'WCSPR'
        }

        if (t === 'USDC') {
            const ratesUSDC = findReservesBySymbols(t, 'USDT', pairTotalReserves, updateNotification)

            return new BigNumber(ratesUSDC.reserve0).div(ratesUSDC.reserve1).plus(1).div(2)
        }

        if (t === 'USDT') {
            const ratesUSDT = findReservesBySymbols(t, 'USDC', pairTotalReserves, updateNotification)

            return new BigNumber(ratesUSDT.reserve0).div(ratesUSDT.reserve1).plus(1).div(2)
        }

        const ratesUSDC = findReservesBySymbols(t, 'USDC', pairTotalReserves, updateNotification)
        const ratesUSDT = findReservesBySymbols(t, 'USDT', pairTotalReserves, updateNotification)

        // console.log('ratesUSDC/T', ratesUSDC.reserve0.toString(), ratesUSDT.reserve0.toString())

        if (ratesUSDC.reserve0.toString() === '0' || ratesUSDT.reserve0.toString() === '0') {
            return new BigNumber(0)
        }

        return new BigNumber(ratesUSDC.reserve1).div(ratesUSDC.reserve0).plus(BigNumber(ratesUSDT.reserve1).div(ratesUSDT.reserve0)).div(2)
    }

    /**
     * findReservesBySymbols search for pair data by the symbol pair
     *
     * @param tokenASymbol first token symbol string
     * @param tokenBSymbol second token symbol string
     *
     * @returns pair reserve data
     */
    const findReservesBySymbols = (
      tokenASymbol: string,
      tokenBSymbol: string,
      overrideReserves: Record<string, PairTotalReserves> = {},
      updateNotification
    ): PairReserves | undefined => {
        let tA = tokenASymbol
        let tB = tokenBSymbol
        if (tA === 'CSPR') {
            tA = 'WCSPR'
        }
        if (tB === 'CSPR') {
            tB = 'WCSPR'
        }

        const tADecimals = tokenState.tokens[tokenASymbol]?.decimals | 9
        const tBDecimals = tokenState.tokens[tokenBSymbol]?.decimals | 9

        let lookUp = `${tA}-${tB}`

        // do a simple look up
        let pairData = overrideReserves[lookUp] ?? orderedPairState()[lookUp]
        if (pairData) {
            // console.log('a', pairData)

            return {
                reserve0: convertUIStringToBigNumber(pairData.totalReserve0, tADecimals),
                reserve1: convertUIStringToBigNumber(pairData.totalReserve1, tBDecimals),
            }
        }
        // do different simple look up
        lookUp = `${tB}-${tA}`
        pairData = overrideReserves[lookUp] ?? orderedPairState()[lookUp]
        if (pairData) {
            //console.log('b', pairData)
            return {
                reserve0: convertUIStringToBigNumber(pairData.totalReserve1, tBDecimals),
                reserve1: convertUIStringToBigNumber(pairData.totalReserve0, tADecimals),
            }
        }

        // use pathfinder for multi-pool
        const path = getPath(
          tA,
          tB,
          Object.values(tokenState.tokens),
          Object.values(pairState)
        )

        if (!path || !path.length) {
            updateNotification({
                type: NotificationType.Error,
                title: `Path between ${tA}-${tB} not found`,
                subtitle: '',
                show: true,
                timeToClose: 10,
                isOnlyNotification: true
            })
            return {
                reserve0: new BigNumber(0),
                reserve1: new BigNumber(0),
            }
        }

        let firstReserve0 = new BigNumber(1)
        let reserve0 = new BigNumber(1)
        let reserve1 = new BigNumber(1)
        for (let i = 1; i < path.length; i++) {
            const pair = overrideReserves[path[i].label.name] ?? path[i].label
            if (path[i - 1].id == tokenASymbol) {
                reserve0 = reserve0.times(convertUIStringToBigNumber(pair.totalReserve1, tBDecimals))
                reserve1 = reserve1.times(convertUIStringToBigNumber(pair.totalReserve0, tADecimals))
            } else {
                reserve0 = reserve0.times(convertUIStringToBigNumber(pair.totalReserve0, tADecimals))
                reserve1 = reserve1.times(convertUIStringToBigNumber(pair.totalReserve1, tBDecimals))
            }

            if (i == 1) {
                firstReserve0 = reserve0
            }
        }

        const ratio = firstReserve0.div(reserve0)

        return {
            reserve0: firstReserve0,
            reserve1: reserve1.times(ratio),
        }
    }

    return {
        orderedPairState,
        findUSDRateBySymbol,
        findReservesBySymbols
    }
}
