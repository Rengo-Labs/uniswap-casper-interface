import {useReducer} from "react";
import {initialTokenState, TokenReducer, TokenState} from "../../reducers/TokenReducers";

const TokenResponsibilities = (tokenState: TokenState, pairDispatch) => {

    const getTokenPrices = () => {
        return tokenState.tokens;
    }

    // const loadUSDBalance = () => {
    //     const tokens = Object.values(tokenState.tokens)
    //     const tokenPrices: Record<string, string> = {}
    //
    //     for (const t of tokens) {
    //         const priceUSD = findUSDRateBySymbol(t.symbolPair, pairTotalReserves).toString()
    //
    //         tokenDispatch({
    //             type: TokenActions.LOAD_PRICE_USD,
    //             payload: {
    //                 name: t.symbol,
    //                 priceUSD,
    //             },
    //         })
    //
    //         tokenPrices[t.symbol] = priceUSD
    //     }
    // }

    const loadToken = async () => {

    }


    return {
        getTokenPrices,
        loadToken
    }

}

export default TokenResponsibilities
