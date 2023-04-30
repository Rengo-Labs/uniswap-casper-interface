import React from "react";
import { TokenActions, TokenState} from "../../reducers/TokenReducers";
import BigNumber from "bignumber.js";
import {convertBigNumberToUIString, log} from "../utils";
import {apiClient, casperClient} from "../../contexts/ConfigContext";
import {Wallet} from "../wallet";
import {Token} from "../api";
import {pairFinder} from "../pairFinder";
import {PairState} from "../../reducers/PairsReducer";
import {
    getBalanceProfitByContractHash,
    getHistoricalTokenPricesByPackageHash,
    TokenProfit
} from "../api/ApolloQueries";

const TokenResponsibilities = (tokenState: TokenState, tokenDispatch) => {

    const loadTokenUSD = async (pairTotalReserves, pairsState, updateNotification) => {
        const tokenPrices: Record<string, string> = {}
        const tokens = Object.values(tokenState.tokens)

        for (const t of tokens) {
            const priceUSD = pairFinder(pairsState, tokenState).findUSDRateBySymbol(t.symbolPair, pairTotalReserves, updateNotification).toString()

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

    const updateBalances = async (wallet: Wallet, isConnected: boolean): Promise<void> => {
        if (!isConnected) {
            return;
        }

        try {
            const ps = Object.keys(tokenState.tokens).map((x) => {
                const token = tokenState.tokens[x];

                //console.log('token', x, token)
                if (tokenState.tokens[x].contractHash) {
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

    //TODO adjust the response from the UI KIT to manage the same structure here
    const filterPopupTokens = (tokensToExclude: any[]): any[] => {
        let _filteredTokens = Object.values(tokenState.tokens).map((v, k) => v)
        if (tokensToExclude.length > 0) {
            tokensToExclude.map((symbol) => {
                _filteredTokens = _filteredTokens.filter((token) => {
                    // CSPR <=> WCSPR cases
                    if (symbol === 'CSPR' && token.symbol === 'WCSPR') {
                        return
                    }

                    if (symbol === 'WCSPR' && token.symbol === 'CSPR') {
                        return
                    }

                    // main case
                    if (symbol !== token.symbol) {
                        return token
                    }
                })

            })
        }
        console.log(_filteredTokens)
        return _filteredTokens.map((token) => {
            const {chainId, symbol, name, amount, logoURI}: any = token;
            return (
              {
                  id: chainId,
                  name: symbol,
                  fullName: name,
                  amount: amount,
                  tokenImg: logoURI
              }
            );
        })
    }

    const filterTokenPairsByToken = (token, pairState: PairState) => {
        const result = Object.values(pairState)
          .filter(pl => {
              return pl.token0Symbol.includes(token) || pl.token1Symbol.includes(token)
          })
          .map((pl) => {
              return pl.token1Symbol.includes(token) ? tokenState.tokens[pl.token0Symbol] : tokenState.tokens[pl.token1Symbol]
          })
        return result.map((token) => {
            const {chainId, symbol, name, amount, logoURI}: any = token;
            return (
              {
                  id: chainId,
                  name: symbol,
                  fullName: name,
                  amount: amount,
                  tokenImg: logoURI
              }
            );
        })
    }

    const getHistoricalTokenPrices = async (packageHash: string) => {
        return getHistoricalTokenPricesByPackageHash(packageHash)
    }

    const getHistoricalTokensChartPrices = async (packageHash0: string, packageHash1: string) => {
        const chart0 = await getHistoricalTokenPricesByPackageHash(packageHash0)
        const chart1 = await getHistoricalTokenPricesByPackageHash(packageHash1)

        const date0 = chart0.map((item) => item?.date)
        const date1 = chart1.map((item) => item?.date)
        const dateFiltered = [];

        if (date0.length > date1.length) {
            date0.map((item) => {
                dateFiltered.push(item)
            })
        } else {
            date1.map((item) => {
                dateFiltered.push(item)
            })
        }

        console.log('@@@@@@@@ dateFiltered', chart0[0])

        const date = dateFiltered.map((item) => {
            const date = new Date(item)
            return `${date.getDate()}/${date.getMonth() + 1}`
        })

        console.log('@@@@@@@@ price', chart0[0]?.priceUSD)

        const priceUSD = chart0 && chart0.length ? parseFloat(chart0[0]?.priceUSD).toFixed(2) : 0
        const percentage = chart0 && chart0.length ? parseFloat(chart0[0]?.percentage).toFixed(2) : 0

        return date.map((item, index) => {
            return {
                name: item,
                token0price: chart0[index]?.priceUSD || 0,
                token1price: chart1[index]?.priceUSD || 0,
                priceUSD: priceUSD,
                percentage: percentage
            }
        })
    }

    const getBalancesProfit = (packageHash: string): Promise<TokenProfit> => {
        return getBalanceProfitByContractHash(packageHash)
    }

    return {
        loadTokenUSD,
        updateBalances,
        clearUserTokensData,
        onSelectFirstToken,
        onSelectSecondToken,
        onSwitchTokens,
        filterPopupTokens,
        filterTokenPairsByToken,
        getHistoricalTokenPrices,
        getBalancesProfit,
        getHistoricalTokensChartPrices
    }

}

export default TokenResponsibilities
