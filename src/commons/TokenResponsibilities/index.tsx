import React from "react";
import { TokenActions, TokenState} from "../../reducers/TokenReducers";
import BigNumber from "bignumber.js";
import {convertBigNumberToUIString, convertToUSDCurrency, log} from "../utils";
import {apiClient, casperClient} from "../../contexts/ConfigContext";
import {Wallet} from "../wallet";
import {Token} from "../api";
import {pairFinder} from "../pairFinder";
import {PairState} from "../../reducers/PairsReducer";
import {
    getBalanceProfitByContractHash,
    getHistoricalTokenPricesByPackageHash,
    TokenProfit,
    getTokenChartData,
    getPercentChangeByToken
} from "../api/ApolloQueries";

const TokenResponsibilities = (tokenState: TokenState, tokenDispatch) => {

    const getCSTMarket = () => {
        const cstToken = tokenState.tokens['CST']
        const market = BigNumber(cstToken.totalSupply ?? 0).multipliedBy(cstToken.priceUSD)
        return convertToUSDCurrency(market.toNumber())
    }

    const loadTokenUSD = async (pairTotalReserves, pairsState, updateNotification) => {
        const tokenPrices: Record<string, string> = {}
        const tokens = Object.values(tokenState.tokens)

        for (const t of tokens) {
            const priceUSD = pairFinder(pairsState, tokenState).findUSDRateBySymbol(t.symbolPair, pairTotalReserves, updateNotification).toString()
            const totalSupply = t.symbol === 'CST' ? await getCSTTotalSupply(t.contractHash) : '0'

            tokenDispatch({
                type: TokenActions.LOAD_PRICE_USD,
                payload: {
                    name: t.symbol,
                    priceUSD,
                    totalSupply: convertBigNumberToUIString(
                      BigNumber(totalSupply.toString()),
                      t.decimals
                    ),
                },
            })

            tokenPrices[t.symbol] = priceUSD
        }

        return tokenPrices
    }

    const updateBalances = async (wallet: Wallet, isConnected: boolean): Promise<void> => {
        if (!isConnected) {
            return;
        }

        try {
            const ps = Object.keys(tokenState.tokens).map((x) => {
                const token = tokenState.tokens[x];

                if (token.contractHash) {
                    return Promise.all([
                        getAllowance(wallet, x, token.decimals, token.contractHash),
                        getTokenBalance(wallet, x, token.decimals, token.contractHash),
                    ]);
                } else {
                    return casperClient.getBalance(wallet).then((balance) => {
                        //console.log('balance', convertBigNumberToUIString(balance, token.decimals))
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
        const token1Hist = await getHistoricalTokenPricesByPackageHash(packageHash0)
        const token2Hist = await getHistoricalTokenPricesByPackageHash(packageHash1)

        const getPriceAndPercentage = (hist) => {
            const length = hist.length - 1
            const priceUSD = hist && hist.length ? parseFloat(hist[length]?.priceUSD).toFixed(2) : 0
            const percentage = hist && hist.length ? parseFloat(hist[length]?.percentage).toFixed(2) : 0

            return {
                priceUSD,
                percentage
            }
        }

        const token0 = getPriceAndPercentage(token1Hist)
        const token1 = getPriceAndPercentage(token2Hist)

        return [token0, token1]
    }

    const getPercentChangeByTokens = async (packageHash0: string, packageHash1: string) => {
        const token0Percent = await getPercentChangeByToken(packageHash0)
        const token1Percent = await getPercentChangeByToken(packageHash1)

        const getPriceAndPercentage = (hist) => {
            const length = 0
            const priceUSD = hist && hist.length ? parseFloat(hist[length]?.nowPrice).toFixed(2) : 0
            const percentage = hist && hist.length ? parseFloat(hist[length]?.percent).toFixed(2) : 0

            return {
                priceUSD,
                percentage
            }
        }

        const token0 = getPriceAndPercentage(token0Percent)
        const token1 = getPriceAndPercentage(token1Percent)

        return [token0, token1]
    }

    const getTokensChartData = async (packageHash0: string, packageHash1: string) => {
        const chart0 = await getTokenChartData(packageHash0)
        const chart1 = await getTokenChartData(packageHash1)
        return [chart0, chart1]
    }

    const getBalancesProfit = (packageHash: string): Promise<TokenProfit> => {
        return getBalanceProfitByContractHash(packageHash)
    }

    const getAllowance = async (wallet, name, decimals, contractHash): Promise<void> => {
        apiClient
          .getERC20Allowance(
            wallet,
            contractHash
          )
          .then((response) => {
              //console.log('allowance', token, response)
              tokenDispatch({
                  type: TokenActions.LOAD_ALLOWANCE,
                  payload: {
                      name: name,
                      allowance: convertBigNumberToUIString(
                        new BigNumber(response),
                        decimals
                      ),
                  },
              });
          }).catch(e => {
            console.log("Error loading pair allowance", name, e)
            tokenDispatch({
                type: TokenActions.LOAD_ALLOWANCE,
                payload: {
                    name: name,
                    allowance: convertBigNumberToUIString(
                      new BigNumber(0),
                      decimals
                    ),
                },
            })
        })
    }

    const getTokenBalance = async (wallet, name, decimals, contractHash): Promise<void> => {
        apiClient
          .getERC20Balance(
            wallet,
            contractHash
          )
          .then((response) => {
              console.log(convertBigNumberToUIString(new BigNumber(response), 9).toString())
              tokenDispatch({
                  type: TokenActions.LOAD_BALANCE,
                  payload: {
                      name: name,
                      amount: convertBigNumberToUIString(
                        new BigNumber(response),
                        decimals
                      ),
                  },
              });
          }).catch(e => {
            console.log("Error loading pair balance", name, e)
            tokenDispatch({
                type: TokenActions.LOAD_BALANCE,
                payload: {
                    name: name,
                    amount: convertBigNumberToUIString(
                      new BigNumber(0),
                      decimals
                    ),
                },
            })
        })
    }

    const getCSTTotalSupply = async (contractHash: string): Promise<string> => {
        return apiClient.getERC20TotalSupply(contractHash)
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
        getTokensChartData,
        getPercentChangeByTokens,
        getAllowance,
        getTokenBalance,
        getCSTTotalSupply,
        getCSTMarket
    }

}

export default TokenResponsibilities
