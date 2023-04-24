import React, {useContext, useState} from 'react';
import TokenSwapper from "../../organisms/TokenSwapper";
import SwapDetail from "../../organisms/SwapDetail";
import {ConfigProviderContext} from "../../../contexts/ConfigContext";
import {WalletProviderContext} from "../../../contexts/WalletContext";
import {SwapProviderContext} from "../../../contexts/SwapContext";
import {ProgressBarProviderContext} from "../../../contexts/ProgressBarContext";
import {PairsContextProvider} from "../../../contexts/PairsContext";
import {StateHashProviderContext} from "../../../contexts/StateHashContext";
import {TokensProviderContext} from "../../../contexts/TokensContext";
import {getListPath, Token} from "../../../commons";
import {DoubleColumn} from '../../../layout/DoubleColumn';

export const SwapTemplate = ({isMobile}) => {
    const {
        onIncreaseAllow,
        gasPriceSelectedForSwapping,
    } = useContext(ConfigProviderContext);

    const {
        onConnectWallet,
        isConnected,
    } = useContext(WalletProviderContext);
    const {onConfirmSwapConfig, getSwapDetails} =
        useContext(SwapProviderContext);
    const {progressBar, getProgress} = useContext(ProgressBarProviderContext);
    const {calculateUSDtokens, pairState, findReservesBySymbols} = useContext(PairsContextProvider)
    const {refresh} = useContext(StateHashProviderContext)
    const {
        firstTokenSelected,
        secondTokenSelected,
        onSelectFirstToken,
        onSelectSecondToken,
        tokenState,
        onSwitchTokens,
        filterPopupTokens
    } = useContext(TokensProviderContext)

    const [pairPath, setPairPath] = useState([])

    const onActionConfirm = async (amountA, amountB, slippage, gas) => {
        await onConfirmSwapConfig(
            amountA,
            amountB,
            slippage,
            gas
        );

        refresh();
    }

    async function updateSwapDetail(
        tokenA: Token,
        tokenB: Token,
        value = 0,
        token = firstTokenSelected,
        slippage
    ) {
        const {getSwapDetailResponse} = await calculateSwapDetailResponse(tokenA, tokenB, value, token, slippage)
        const {tokensToTransfer, priceImpact, exchangeRateA, exchangeRateB, routePath} =
            getSwapDetailResponse;

        return {tokensToTransfer, exchangeRateA, exchangeRateB, priceImpact, routePath};
    }

    const calculateSwapDetailResponse = async (tokenA: Token, tokenB: Token, value: number, token: Token, slippage) => {
        const isAorB = tokenA.symbol === token.symbol
        const [param, param1] = isAorB ? [tokenA.symbol, tokenB.symbol] : [tokenB.symbol, tokenA.symbol]
        const listPath = getListPath(param, param1, Object.values(tokenState.tokens), Object.values(pairState))
        const pairExist = listPath.length == 0

        let getSwapDetailResponse = null;
        let nextTokensToTransfer = value

        if (pairExist) {
            const {reserve0, reserve1} = findReservesBySymbols(
                tokenA.symbol,
                tokenB.symbol,
                tokenState
            );
            getSwapDetailResponse = await getSwapDetails(
                tokenA,
                tokenB,
                reserve0,
                reserve1,
                value,
                token,
                slippage,
                gasPriceSelectedForSwapping
            );
            setPairPath([tokenA.symbol, tokenB.symbol])
        } else {
            const pairListPaths = listPath
            let priceImpactAcm: any = 0
            const pairPath = []
            for (const pair of pairListPaths) {
                const {symbol0, symbol1} = pair
                const {reserve0, reserve1} = findReservesBySymbols(
                    symbol0,
                    symbol1,
                    tokenState
                );
                getSwapDetailResponse = await getSwapDetails(
                    {symbol: symbol0} as any,
                    {symbol: symbol1} as any,
                    reserve0,
                    reserve1,
                    nextTokensToTransfer,
                    {symbol: symbol0} as any,
                    slippage,
                    gasPriceSelectedForSwapping
                );

                const {tokensToTransfer, priceImpact} = getSwapDetailResponse
                priceImpact !== '<0.01' ? priceImpactAcm += parseFloat(priceImpact.toString()) : priceImpactAcm = priceImpact
                getSwapDetailResponse.priceImpact = isNaN(priceImpactAcm) ? priceImpactAcm : priceImpactAcm.toFixed(2)
                nextTokensToTransfer = parseFloat(tokensToTransfer.toString())
                pairPath.push(symbol0, symbol1)
            }
            setPairPath([...new Set(pairPath)])
        }

        return {
            getSwapDetailResponse
        }
    }

    return (
        <>
            <DoubleColumn isMobile={isMobile} title="Swap">
                <SwapDetail
                    firstTokenImg={firstTokenSelected?.logoURI || ''}
                    secondTokenImg={secondTokenSelected?.logoURI || ''}
                    firstSelectedToken={firstTokenSelected}
                    gasFee={gasPriceSelectedForSwapping}
                    secondSelectedToken={secondTokenSelected}
                    slippageTolerance={0.005}
                />
                <TokenSwapper
                    onIncreaseAllow={onIncreaseAllow}
                    gasPriceSelectedForSwapping={gasPriceSelectedForSwapping}
                    onConnectWallet={onConnectWallet}
                    isConnected={isConnected}
                    progressBar={progressBar}
                    getProgress={getProgress}
                    calculateUSDtokens={calculateUSDtokens}
                    pairState={pairState}
                    refresh={refresh}
                    firstTokenSelected={firstTokenSelected}
                    secondTokenSelected={secondTokenSelected}
                    onSelectFirstToken={onSelectFirstToken}
                    onSelectSecondToken={onSelectSecondToken}
                    tokenState={tokenState}
                    onSwitchTokens={onSwitchTokens}
                    onActionConfirm={onActionConfirm}
                    filterPopupTokens={filterPopupTokens}
                    updateDetail={updateSwapDetail}
                />
            </DoubleColumn>
        </>
    )
};
