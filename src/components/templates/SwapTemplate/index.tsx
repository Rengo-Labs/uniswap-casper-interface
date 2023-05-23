import React, {useContext, useEffect, useState} from 'react';
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
import {calculateMinimumTokenReceived} from '../../../contexts/PriceImpactContext';
import isCSPRValid from "../../../hooks/isCSPRValid";
import {globalStore} from "../../../store/store";
import {PLATFORM_GAS_FEE} from '../../../constant'

export const SwapTemplate = ({isMobile}) => {
    const {
        onIncreaseAllow,
        gasPriceSelectedForSwapping,
        adjustedGas
    } = useContext(ConfigProviderContext);

    const {
        onConnectWallet,
        isConnected,
    } = useContext(WalletProviderContext);
    const {onConfirmSwapConfig, getSwapDetails} =
        useContext(SwapProviderContext);
    const {progressBar, getProgress, clearProgress} = useContext(ProgressBarProviderContext);
    const {calculateUSDtokens, pairState, findReservesBySymbols} = useContext(PairsContextProvider)
    const {refresh} = useContext(StateHashProviderContext)
    const {
        firstTokenSelected,
        secondTokenSelected,
        onSelectFirstToken,
        onSelectSecondToken,
        tokenState,
        onSwitchTokens,
        filterPopupTokens,
        getHistoricalTokensChartPrices,
        getTokensChartData
    } = useContext(TokensProviderContext)
    // Details requirements
    const { handleValidate, showNotification } =
        isCSPRValid();
    const [pairPath, setPairPath] = useState([])
    const [gasFee, gasFeeSetter] = useState<number>(gasPriceSelectedForSwapping);
    const [currentValue, setCurrentValue] = useState<number>(0);
    const [amountSwapTokenA, amountSwapTokenASetter] = useState<number>(0);
    const [amountSwapTokenB, amountSwapTokenBSetter] = useState<number>(0);
    const [defaultPriceImpactLabel, defaultPriceImpactLabelSetter] =
        useState<string>('Low Price Impact');
    const [priceImpact, priceImpactSetter] = useState<number | string>(0);
    const { slippageTolerance, updateSlippageTolerance } = globalStore()
    const [isProcessingTransaction, setIsProcessingTransaction] = useState(false)
    const [showChart0, setShowChart0] = useState(true)
    const [showChart1, setShowChart1] = useState(false)
    const [chartData,  setChartData] = useState([
        {
            priceUSD: 0,
            percentage: 0,
            name: '',
            token0price: 0,
            token1price: 0
        }
    ])

    const [priceAndPercentage, setPriceAndPercentage] = useState({
        priceUSD: 0,
        percentage: 0,
    })

    useEffect(() => {
        handleGetChartData().then(() => console.log('chart updated'))
    }, [firstTokenSelected, secondTokenSelected])

    const handleChangeGasFee = (value) => {
        const gasFeeValue = value ? parseFloat(value) : 0;
        if (gasFeeValue === 0)  {
            showNotification('The gas fee needs to be greater than 0')
            return;
        }
        gasFeeSetter(value);
        handleValidate(currentValue, parseFloat(firstTokenSelected.amount), gasFeeValue);
    }

    const handleGetChartData = async () => {
        //const chartData = await getHistoricalTokensChartPrices(firstTokenSelected.packageHash, secondTokenSelected.packageHash)
        const chartData = await getTokensChartData(firstTokenSelected.packageHash, secondTokenSelected.packageHash)
        // console.log('chartData', showChart0, showChart1)

        setChartData(chartData[1])
        // setChartData(chartData[1])


        // if(chartData.length > 0) {
        //     setPriceAndPercentage((prevState) => ({
        //         ...prevState,
        //         priceUSD: chartData[chartData.length - 1].priceUSD,
        //         percentage: chartData[chartData.length - 1].percentage
        //     }))
        // }
        //
        // let pairName = `${firstTokenSelected.symbol === 'CSPR' ? 'WCSPR': firstTokenSelected.symbol }-${secondTokenSelected.symbol === 'CSPR' ? 'WCSPR': secondTokenSelected.symbol}`
        // if(!pairState[pairName]) {
        //     pairName = `${secondTokenSelected.symbol === 'CSPR' ? 'WCSPR': secondTokenSelected.symbol }-${firstTokenSelected.symbol === 'CSPR' ? 'WCSPR': firstTokenSelected.symbol}`
        // }
        //
        // const pair = pairState[pairName]
        //
        // if(!pairState[pairName]) {
        //     return []
        // }
        //
        // const packageHash = pair.packageHash.slice(5, pair.packageHash.length)
        // const data = await getPairChart(packageHash)
        //
        // if(data.length > 0) {
        //     setChartData(data)
        // }
    }

    const handlesShowChart0 = () => {
        setShowChart0(!showChart0)
    }

    const handleShowChart1 = () => {
        setShowChart1(!showChart1)
    }

    const resetTokenValues =  () => {
        amountSwapTokenASetter(0);
        amountSwapTokenBSetter(0);
    }

    const onActionConfirm = async (amountA, amountB) => {
        setIsProcessingTransaction(true)
        const isValid = await onConfirmSwapConfig(
            amountA,
            amountB,
            slippageTolerance,
            gasFee
        );

        if (isValid) {
            resetTokenValues();
        }

        await refresh();
        setIsProcessingTransaction(false)
    }

    async function updateSwapDetail(
        tokenA: Token,
        tokenB: Token,
        value = 0,
        token = firstTokenSelected,
        isSwitched = false
    ) {
        const {getSwapDetailResponse} = await calculateSwapDetailResponse(tokenA, tokenB, value, token, isSwitched)
        const {tokensToTransfer, priceImpact, exchangeRateA, exchangeRateB, routePath} =
            getSwapDetailResponse;

        // TODO REVIEW DETAILS
        priceImpactSetter(priceImpact);
        defaultPriceImpactLabelSetter(
            parseFloat(priceImpact as any) > 1
                ? 'Price Impact Warning'
                : 'Low Price Impact'
        );

        return {tokensToTransfer, exchangeRateA, exchangeRateB, priceImpact, routePath};
    }

    const calculateSwapDetailResponse = async (tokenA: Token, tokenB: Token, value: number, token: Token, isSwitched: boolean) => {
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
                token
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
                const token0 = tokenState.tokens[symbol0]
                const token1 = tokenState.tokens[symbol0]
                getSwapDetailResponse = await getSwapDetails(
                    token0,
                    token1,
                    reserve0,
                    reserve1,
                    nextTokensToTransfer,
                    {symbol: symbol0} as any
                );

                const {tokensToTransfer, priceImpact} = getSwapDetailResponse
                priceImpact !== '<0.01' ? priceImpactAcm += parseFloat(priceImpact.toString()) : priceImpactAcm = priceImpact
                getSwapDetailResponse.priceImpact = isNaN(priceImpactAcm) ? priceImpactAcm : priceImpactAcm.toFixed(2)
                nextTokensToTransfer = parseFloat(tokensToTransfer.toString())
                pairPath.push(symbol0, symbol1)
            }
            setPairPath([...new Set(pairPath)])
        }

        if (isSwitched) {
            gasFeeSetter(adjustedGas(gasPriceSelectedForSwapping, tokenA.symbol, tokenB.symbol ,pairExist ? 0 : (listPath.length -1)))
        }

        return {
            getSwapDetailResponse
        }
    }

    return (
        <>
            <DoubleColumn isMobile={isMobile} title="Swap">
                <SwapDetail
                    firstTokenImg={firstTokenSelected.logoURI || ''}
                    secondTokenImg={secondTokenSelected.logoURI || ''}
                    firstSelectedToken={firstTokenSelected}
                    platformGasFee={PLATFORM_GAS_FEE}
                    secondSelectedToken={secondTokenSelected}
                    slippageTolerance={slippageTolerance}
                    calculateMinimumTokenReceived={calculateMinimumTokenReceived}
                    firstSymbolToken={firstTokenSelected.symbol}
                    firstTokenAmount={amountSwapTokenA}
                    networkGasFee={gasFee}
                    networkGasFeeSetter={handleChangeGasFee}
                    pairPath={pairPath}
                    priceImpact={priceImpact}
                    priceImpactMessage={defaultPriceImpactLabel}
                    secondSymbolToken={secondTokenSelected.symbol}
                    secondTokenAmount={amountSwapTokenB}
                    slippageSetter={updateSlippageTolerance}
                    //chart
                    chartData={chartData}
                    xAxisName='name'
                    todayPrice={`${priceAndPercentage.priceUSD}`}
                    yesterdayPrice={`${priceAndPercentage.percentage}`}
                    chart0Name='token0price'
                    chart1Name='token1price'
                    onClickButton0={handlesShowChart0}
                    onClickButton1={handleShowChart1}
                    showChart0={showChart0}
                    showChart1={showChart1}
                />
                <TokenSwapper
                    onIncreaseAllow={onIncreaseAllow}
                    gasPriceSelectedForSwapping={gasFee}
                    onConnectWallet={onConnectWallet}
                    isConnected={isConnected}
                    progressBar={progressBar}
                    getProgress={getProgress}
                    calculateUSDtokens={calculateUSDtokens}
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
                    amountSwapTokenA={amountSwapTokenA}
                    amountSwapTokenASetter={amountSwapTokenASetter}
                    amountSwapTokenB={amountSwapTokenB}
                    amountSwapTokenBSetter={amountSwapTokenBSetter}
                    isProcessingTransaction={isProcessingTransaction}
                    clearProgress={clearProgress}
                />
            </DoubleColumn>
        </>
    )
};
