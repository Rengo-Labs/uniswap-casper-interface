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
    TokenProfit,
    getTokenChartData
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
                                        new BigNumber(response),
                                        token.decimals
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
                              console.log(x, convertBigNumberToUIString(new BigNumber(response), token.decimals).toString())
                              tokenDispatch({
                                  type: TokenActions.LOAD_BALANCE,
                                  payload: {
                                      name: x,
                                      amount: convertBigNumberToUIString(
                                        new BigNumber(response),
                                        token.decimals
                                      ),
                                  },
                              });
                          }),
                    ]);
                } else {
                    return casperClient.getBalance(wallet).then((balance) => {
                        console.log('balance', convertBigNumberToUIString(balance, token.decimals))
                        tokenDispatch({
                            type: TokenActions.LOAD_BALANCE,
                            payload: {
                                name: 'CSPR',
                                amount: convertBigNumberToUIString(
                                  balance,
                                  token.decimals),
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
        Object.keys(tokenState.tokens).map((x) => {
            if (tokenState.tokens[x].contractHash) {
                tokenDispatch({
                    type: TokenActions.LOAD_ALLOWANCE,
                    payload: {
                        name: x,
                        allowance: convertBigNumberToUIString(
                          new BigNumber(0),
                          tokenState.tokens[x].decimals
                        ),
                    },
                })

                tokenDispatch({
                    type: TokenActions.LOAD_BALANCE,
                    payload: {
                        name: x,
                        amount: convertBigNumberToUIString(
                          new BigNumber(0),
                          tokenState.tokens[x].decimals
                        ),
                    },
                })
            } else {
                tokenDispatch({
                    type: TokenActions.LOAD_BALANCE,
                    payload: {
                        name: 'CSPR',
                        amount: convertBigNumberToUIString(new BigNumber(0), tokenState.tokens[x].decimals),
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
    const filterPopupTokens = (tokensToExclude: any[], isFirstInput): any[] => {
        let _filteredTokens = Object.values(tokenState.tokens).map((v, k) => v)
        if (tokensToExclude.length > 0) {
            tokensToExclude.map((symbol, idx) => {
                _filteredTokens = _filteredTokens.filter((token) => {
                    // main case
                    if (symbol !== token.symbol) {
                        return token
                    }
                })

            })
        }

        if(tokensToExclude[0] === 'CSPR' && isFirstInput) {
            _filteredTokens = _filteredTokens.filter(token => token.symbol !== 'CSPR')
        } else if(tokensToExclude[0] === 'WCSPR' && isFirstInput) {
            _filteredTokens = _filteredTokens.filter(token => token.symbol !== 'WCSPR')
        } else if(tokensToExclude[1] === 'CSPR' && !isFirstInput) {
            _filteredTokens = _filteredTokens.filter(token => token.symbol !== 'CSPR')
        } else if(tokensToExclude[1] === 'WCSPR' && !isFirstInput) {
            _filteredTokens = _filteredTokens.filter(token => token.symbol !== 'WCSPR')
        } else if (tokensToExclude.includes('CSPR') || tokensToExclude.includes('WCSPR')) {
            _filteredTokens = _filteredTokens.filter(token => token.symbol !== 'WCSPR' && token.symbol !== 'CSPR')
        }

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
        const filter = token === 'CSPR' ? 'WCSPR' : token
        const result = Object.values(pairState)
          .filter(pl => {
              return filter === pl.token0Symbol || filter === pl.token1Symbol
          })
          .map((pl) => {
              return pl.token1Symbol.includes(filter) ? tokenState.tokens[pl.token0Symbol] : tokenState.tokens[pl.token1Symbol]
          })

        if (token !== 'CSPR' && token !== 'WCSPR')
            result.push(tokenState.tokens['CSPR'])

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

        console.log('chart0', chart0)
        console.log('chart1', chart1)


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

        const date = dateFiltered.map((item) => {
            console.log('#### item ####', item)
            const date = new Date(item * 1000)
            console.log('#### date ####', date)
            return `${date.getDate()}/${date.getMonth() + 1}`
        })

        const priceUSD = chart0 && chart0.length ? parseFloat(chart0[chart0.length - 1]?.priceUSD).toFixed(2) : 0
        const percentage = chart0 && chart0.length ? parseFloat(chart0[chart0.length - 1]?.percentage).toFixed(2) : 0

        return date.map((item, index) => {
            const token0price = chart0 && chart0.length && parseFloat(chart0[index]?.priceUSD).toFixed(2) || 0
            const token1price =  chart1 && chart1.length && parseFloat(chart1[index]?.priceUSD).toFixed(2) || 0

            return {
                name: item,
                token0price: token0price,
                token1price: token1price,
                priceUSD: priceUSD,
                percentage: percentage
            }
        })
    }

    const getTokensChartData = async (packageHash0: string, packageHash1: string) => {
        console.log('packageHash0', packageHash0)
        console.log('packageHash1', packageHash1)
        const chart0 = await getTokenChartData(packageHash0)
        const chart1 = await getTokenChartData(packageHash1)
        return [chart0, chart1]
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
        getHistoricalTokensChartPrices,
        getTokensChartData
    }

}

export default TokenResponsibilities
