import React from "react";
import { TokenActions, TokenState} from "../../reducers/TokenReducers";
import BigNumber from "bignumber.js";
import {convertBigNumberToUIString, convertUIStringToBigNumber, log} from "../utils";
import {getPath} from "../calculations";
import {apiClient, casperClient, PairReserves} from "../../contexts/ConfigContext";
import {Wallet} from "../wallet";
import {Token} from "../api";
import {pairFinder} from "../pairFinder";

const TokenResponsibilities = (tokenState: TokenState, tokenDispatch) => {

    const loadTokenUSD = async (pairTotalReserves, pairsState, orderedPairState) => {
        const tokenPrices: Record<string, string> = {}
        const tokens = Object.values(tokenState.tokens)

        for (const t of tokens) {
            const priceUSD = pairFinder(pairsState, tokenState).findUSDRateBySymbol(t.symbolPair, pairTotalReserves).toString()

            tokenDispatch({
                type: TokenActions.LOAD_PRICE_USD,
                payload: {
                    name: t.symbol,
                    priceUSD,
                },
            })

            tokenPrices[t.symbol] = priceUSD
        }

        return tokens
    }
/*
    const findUSDRateBySymbol = (
      tokenSymbol: string,
      pairTotalReserves: Record<string, any>,
      pairsState,
      orderedPairState
    ): BigNumber => {
        let t = tokenSymbol
        if (t === 'CSPR') {
            t = 'WCSPR'
        }

        if (t === 'USDC') {
            const ratesUSDC = findReservesBySymbols(t, 'USDT', pairTotalReserves, pairsState, orderedPairState)

            return new BigNumber(ratesUSDC.reserve0).div(ratesUSDC.reserve1).plus(1).div(2)
        }

        if (t === 'USDT') {
            const ratesUSDT = findReservesBySymbols(t, 'USDC', pairTotalReserves, pairsState, orderedPairState)

            return new BigNumber(ratesUSDT.reserve0).div(ratesUSDT.reserve1).plus(1).div(2)
        }

        const ratesUSDC = findReservesBySymbols(t, 'USDC', pairTotalReserves, pairsState, orderedPairState)
        const ratesUSDT = findReservesBySymbols(t, 'USDT', pairTotalReserves, pairsState, orderedPairState)

        console.log('ratesUSDC/T', ratesUSDC.reserve0.toString(), ratesUSDT.reserve0.toString())

        if (ratesUSDC.reserve0.toString() === new BigNumber(0).toString()) {
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
    /*
    const findReservesBySymbols = (
      tokenASymbol: string,
      tokenBSymbol: string,
      overrideReserves: Record<string, any> = {},
      pairState,
      orderedPairState
    ): PairReserves | undefined => {
        let tA = tokenASymbol
        let tB = tokenBSymbol
        if (tA === 'CSPR') {
            tA = 'WCSPR'
        }
        if (tB === 'CSPR') {
            tB = 'WCSPR'
        }

        let lookUp = `${tA}-${tB}`

        // do a simple look up
        let pairData = overrideReserves[lookUp] ?? orderedPairState[lookUp]

        if (pairData) {
            // console.log('a', pairData)
            return {
                reserve0: convertUIStringToBigNumber(pairData.totalReserve0),
                reserve1: convertUIStringToBigNumber(pairData.totalReserve1),
            }
        }

        // do different simple look up
        lookUp = `${tB}-${tA}`
        pairData = overrideReserves[lookUp] ?? orderedPairState[lookUp]

        if (pairData) {
            //console.log('b', pairData)
            return {
                reserve0: convertUIStringToBigNumber(pairData.totalReserve1),
                reserve1: convertUIStringToBigNumber(pairData.totalReserve0),
            }
        }

        // use pathfinder for multi-pool
        const path = getPath(
          tA,
          tB,
          Object.values(tokenState.tokens),
          Object.values(pairState)
        )

        console.log('path', path)

        let firstReserve0 = new BigNumber(1)
        let reserve0 = new BigNumber(1)
        let reserve1 = new BigNumber(1)
        for (let i = 1; i < path.length; i++) {
            const pair = overrideReserves[path[i].label.name] ?? path[i].label
            if (path[i - 1].id == tokenASymbol) {
                reserve0 = reserve0.times(convertUIStringToBigNumber(pair.totalReserve1))
                reserve1 = reserve1.times(convertUIStringToBigNumber(pair.totalReserve0))
            } else {
                reserve0 = reserve0.times(convertUIStringToBigNumber(pair.totalReserve0))
                reserve1 = reserve1.times(convertUIStringToBigNumber(pair.totalReserve1))
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
*/

    const updateBalances = async (wallet: Wallet, isConnected: boolean): Promise<void> => {
        if (!isConnected) {
            return;
        }

        try {
            //console.log('tokenState', tokenState)
            const ps = Object.keys(tokenState).map((x) => {
                const token = tokenState[x];

                //console.log('token', x, token)
                if (tokenState[x].contractHash) {
                    return Promise.all([
                        apiClient
                          .getERC20Allowance(
                            wallet,
                            token.contractHash
                          )
                          .then((response) => {
                              //console.log('allowance', token, response)
                              tokenDispatch({
                                  type: TokenActions.LOAD_ALLOWANCE,
                                  payload: {
                                      name: x,
                                      allowance: convertBigNumberToUIString(
                                        new BigNumber(response)
                                      ),
                                  },
                              });
                          }),
                        apiClient
                          .getERC20Balance(
                            wallet,
                            token.contractHash
                          )
                          .then((response) => {
                              //console.log('balance', token, response)
                              console.log(x, convertBigNumberToUIString(new BigNumber(response)).toString())
                              tokenDispatch({
                                  type: TokenActions.LOAD_BALANCE,
                                  payload: {
                                      name: x,
                                      amount: convertBigNumberToUIString(
                                        new BigNumber(response)
                                      ),
                                  },
                              });
                          }),
                    ]);
                } else {
                    return casperClient.getBalance(wallet).then((balance) => {
                        //console.log('balance', convertBigNumberToUIString(balance))
                        tokenDispatch({
                            type: TokenActions.LOAD_BALANCE,
                            payload: {
                                name: 'CSPR',
                                amount: convertBigNumberToUIString(balance),
                            },
                        });
                    });
                }
            });

            await Promise.all(ps);
        } catch (err) {
            log.error(`updateBalances error: ${err}`);
        }
    }

    const clearUserTokensData = async () => {
        Object.keys(tokenState).map((x) => {
            if (tokenState[x].contractHash) {
                tokenDispatch({
                    type: TokenActions.LOAD_ALLOWANCE,
                    payload: {
                        name: x,
                        allowance: convertBigNumberToUIString(
                          new BigNumber(0)
                        ),
                    },
                })

                tokenDispatch({
                    type: TokenActions.LOAD_BALANCE,
                    payload: {
                        name: x,
                        amount: convertBigNumberToUIString(
                          new BigNumber(0)
                        ),
                    },
                })
            } else {
                tokenDispatch({
                    type: TokenActions.LOAD_BALANCE,
                    payload: {
                        name: 'CSPR',
                        amount: convertBigNumberToUIString(new BigNumber(0)),
                    },
                })
            }
        });
    }

    const onSelectFirstToken = (token: string | Token): void => {
        if (typeof token === 'string') {
            tokenDispatch({ type: TokenActions.SELECT_FIRST_TOKEN, payload: token });
        } else {
            tokenDispatch({
                type: TokenActions.SELECT_FIRST_TOKEN,
                payload: token.symbol,
            });
        }
    }

    const onSelectSecondToken = (token: string | Token): void  => {
        if (typeof token === 'string') {
            tokenDispatch({ type: TokenActions.SELECT_SECOND_TOKEN, payload: token });
        } else {
            tokenDispatch({
                type: TokenActions.SELECT_SECOND_TOKEN,
                payload: token.symbol,
            });
        }
    }

    const onSwitchTokens = (): void => {
        tokenDispatch({ type: TokenActions.SWITCH_TOKENS });
    }


    return {
        loadTokenUSD,
        updateBalances,
        clearUserTokensData,
        onSelectFirstToken,
        onSelectSecondToken,
        onSwitchTokens,
    }

}

export default TokenResponsibilities
