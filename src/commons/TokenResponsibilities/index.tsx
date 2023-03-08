import React from "react";
import { TokenActions, TokenState} from "../../reducers/TokenReducers";
import BigNumber from "bignumber.js";
import {convertBigNumberToUIString, log} from "../utils";
import {apiClient, casperClient} from "../../contexts/ConfigContext";
import {Wallet} from "../wallet";
import {Token} from "../api";
import {pairFinder} from "../pairFinder";

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
