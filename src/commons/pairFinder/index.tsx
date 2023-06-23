
import { convertUIStringToBigNumber } from "../utils";
import BigNumber from "bignumber.js";
import { PairState } from "../../reducers/PairsReducer";
import { PairReserves } from "../../contexts/ConfigContext";
import { TokenState } from "../../reducers/TokenReducers";
import { getPath } from "../calculations";
import { NotificationType } from "../../constant";
import { PairTotalReserves } from "../PairsResponsibilities";

export const pairFinder = (pairState: PairState, tokenState?: TokenState) => {

    const USDT_SYMBOL = 'casper-testing' === process.env.REACT_APP_NETWORK_KEY ? 'USDT' : 'dUSDT'
    const USDC_SYMBOL = 'casper-testing' === process.env.REACT_APP_NETWORK_KEY ? 'USDC' : 'dUSDC'

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

        if (t === USDC_SYMBOL) {
            return new BigNumber(1)
        }

        if (t === USDT_SYMBOL) {
            return new BigNumber(1)
        }

        const ratesUSDC = findReservesBySymbols(t, USDC_SYMBOL, pairTotalReserves, updateNotification)
        const ratesUSDT = findReservesBySymbols(t, USDT_SYMBOL, pairTotalReserves, updateNotification)

        const cr0 = new BigNumber(ratesUSDC.reserve0).div(new BigNumber(10).pow(ratesUSDC.decimals0))
        const cr1 = new BigNumber(ratesUSDC.reserve1).div(new BigNumber(10).pow(ratesUSDC.decimals1))
        const tr0 = new BigNumber(ratesUSDT.reserve0).div(new BigNumber(10).pow(ratesUSDT.decimals0))
        const tr1 = new BigNumber(ratesUSDT.reserve1).div(new BigNumber(10).pow(ratesUSDT.decimals1))

        if (ratesUSDC.reserve0.toString() === '0' || ratesUSDT.reserve0.toString() === '0') {
            return new BigNumber(0)
        }

        return new BigNumber(cr1.div(cr0)            
          ).plus(
            tr1.div(tr0)
          ).div(2)
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

        const tADecimals = tokenState.tokens[tokenASymbol]?.decimals || 9
        const tBDecimals = tokenState.tokens[tokenBSymbol]?.decimals || 9

        let lookUp = `${tA}-${tB}`

        // do a simple look up
        let pairData = overrideReserves[lookUp] ?? orderedPairState()[lookUp]
        if (pairData) {
            return {
                reserve0: convertUIStringToBigNumber(pairData.totalReserve0, tADecimals),
                reserve1: convertUIStringToBigNumber(pairData.totalReserve1, tBDecimals),
                decimals0: tADecimals,
                decimals1: tBDecimals,
            }
        }
        // do different simple look up
        lookUp = `${tB}-${tA}`
        pairData = overrideReserves[lookUp] ?? orderedPairState()[lookUp]
        if (pairData) {
            return {
                reserve0: convertUIStringToBigNumber(pairData.totalReserve1, tADecimals),
                reserve1: convertUIStringToBigNumber(pairData.totalReserve0, tBDecimals),
                decimals0: tADecimals,
                decimals1: tBDecimals,
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
                decimals0: new BigNumber(0),
                decimals1: new BigNumber(0),
            }
        }

        // console.log('path', lookUp)

        let first = true
        let firstReserve0 = new BigNumber(1)
        let reserve0 = new BigNumber(1)
        let reserve1 = new BigNumber(1)
        for (let i = 1; i < path.length; i++) {
            const pair = overrideReserves[path[i].label.name] ?? path[i].label
            if (path[i - 1].id == tokenASymbol) {
                const token0 = tokenState.tokens[tokenASymbol]
                const token1 = tokenState.tokens[tokenBSymbol]

                if (!token0 || !token1) {
                  continue
                }

                reserve0 = reserve0.times(convertUIStringToBigNumber(pair.totalReserve0, token0.decimals))
                reserve1 = reserve1.times(convertUIStringToBigNumber(pair.totalReserve1, token1.decimals))
            } else {
                const token0 = tokenState.tokens[tokenASymbol]
                const token1 = tokenState.tokens[tokenBSymbol]

                if (!token0 || !token1) {
                  continue
                }
              
                reserve0 = reserve0.times(convertUIStringToBigNumber(pair.totalReserve1, token1.decimals))
                reserve1 = reserve1.times(convertUIStringToBigNumber(pair.totalReserve0, token0.decimals))
            }

            if (first) {
                firstReserve0 = reserve0
                first = false
            }
        }

        const ratio = firstReserve0.div(reserve0)

        return {
            reserve0: convertUIStringToBigNumber(firstReserve0, tADecimals),
            reserve1: convertUIStringToBigNumber(reserve1.times(ratio), tBDecimals),
            decimals0: tADecimals,
            decimals1: tBDecimals,
        }
    }

    return {
        orderedPairState,
        findUSDRateBySymbol,
        findReservesBySymbols
    }
}
