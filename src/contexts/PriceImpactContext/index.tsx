import axios from 'axios';
import React, { createContext } from 'react'

import { BASE_URL } from '../../constant';

export const ConfigProviderContext = createContext<any>({})

/***
 * it returns tokensToTransfer, priceImpact, minTokenBToTransfer, exchangeRateA and exchangeRateB that belong to the swap detail
 * @param firstTokenSelected
 * @param secondTokenSelected
 * @param value
 * @param slippage
 * @param fee
 */
const getSwapDetail = async (firstTokenSelected, secondTokenSelected, value, slippage = 0.005, fee = 0.003) => {
    try {
        const response = await axios.post(`${BASE_URL}/getpathreserves`, {
            path: [
                firstTokenSelected.symbolPair,
                secondTokenSelected.symbolPair,
            ]
        })
        if (response.data.success) {

            const liquidityA = parseFloat(response.data.reserve0)
            const liquidityB = parseFloat(response.data.reserve1)
            const tokenToTrade = parseFloat(value) * (1 - fee)

            const constantProduct = liquidityA * liquidityB
            console.log("liquidityA", liquidityA, "liquidityB", liquidityB, "constant_product", constantProduct, "tokenToTrade", tokenToTrade)

            const newLiquidityAPool = liquidityA + tokenToTrade
            const newLiquidityBPool = constantProduct / newLiquidityAPool
            console.log("new_liquidity_a_pool", newLiquidityAPool, "new_liquidity_b_pool", newLiquidityBPool)

            const tokensToTransfer = (liquidityB - newLiquidityBPool)
            console.log("tokensToTransfer", tokensToTransfer)

            const exchangeRateA = tokensToTransfer / parseFloat(value)
            const exchangeRateB = parseFloat(value) / tokensToTransfer
            console.log("exchangeRateA", exchangeRateA, "exchangeRateB", exchangeRateB)

            const priceImpact = ((tokenToTrade / (liquidityA + tokenToTrade)) * 100)
            console.log("priceImpact", priceImpact)

            return {
                tokensToTransfer: tokensToTransfer.toFixed(8),
                priceImpact: priceImpact >= 0.01 ? priceImpact.toFixed(2) : '<0.01',
                exchangeRateA,
                exchangeRateB
            }
        }
        throw Error()
    } catch (error) {
        console.log(__filename, "getSwapDetail", error)
        return { tokensToTransfer: 0, tokenPrice: 0, priceImpact: 0, exchangeRateA: 0, exchangeRateB: 0 }
    }
}

const getPairTokenReserve = async (tokenA, tokenB) => {
    const response = await axios.get(`${BASE_URL}/getpairlist`)
    if (response.data.success) {
        const list = response.data.pairList

        let pair = list.filter(p => p.token0.symbol === tokenA && p.token1.symbol === tokenB)
        console.log(pair)
        if (pair.length != 0)
            return {success: true, liquidityA: parseFloat(pair[0].reserve0), liquidityB: parseFloat(pair[0].reserve1)}

        pair = list.filter(p => p.token0.symbol === tokenB && p.token1.symbol === tokenA)
        console.log(pair)
        if (pair.length != 0)
            return {success: true, liquidityA: parseFloat(pair[0].reserve1), liquidityB: parseFloat(pair[0].reserve0)}
    }

    return {success: false, liquidityA: 0, liquidityB: 0}
}

const calculateMinimumTokenReceived = (tokensToTransfer, slippage) => {
    return (tokensToTransfer - tokensToTransfer * slippage / 100).toFixed(8)
}

const calculateReserves = async (firstTokenSelected, secondTokenSelected, value) => {
    try {
        const response = await axios.post(`${BASE_URL}/getpathreserves`, {
            path: [
                firstTokenSelected.symbolPair,
                secondTokenSelected.symbolPair,
            ]
        })
        if (response.data.success) {
            const secondTokenReturn = parseFloat((value * parseFloat(response.data.reserve0)).toString().slice(0, 10))
            const minAmountReturn = (secondTokenReturn - (secondTokenReturn * 0.5) / 100).toString().slice(0, 5)
            return { secondTokenReturn, minAmountReturn }
        }
        throw Error()
    } catch (error) {
        console.log(__filename, "onCalculateReserves", error)
        return { secondTokenReturn: 0, minAmountReturn: 0 }
    }
}