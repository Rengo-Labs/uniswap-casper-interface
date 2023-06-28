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
import BigNumber from "bignumber.js";
import {CSPRPackageHash} from '../../../constant/bootEnvironmet'

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
        getPercentChangeByTokens
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
    const [valueAUSD, setValueAUSD] = useState('0.00');
    const [valueBUSD, setValueBUSD] = useState('0.00');

    const [priceAndPercentage, setPriceAndPercentage] = useState({
        priceUSD: 0,
        percentage: 0,
    })

    const [platformGas, setPlatformGas] = useState(PLATFORM_GAS_FEE)

    useEffect(() => {
        handleGetChartData().then(() => console.log('chart updated'))
    }, [firstTokenSelected, secondTokenSelected, showChart0])

    const handleChangeGasFee = (value) => {
        const gasFeeValue = value ? parseFloat(value) : 0;
        if (gasFeeValue === 0)  {
            showNotification('The gas fee needs to be greater than 0')
            return;
        }
        gasFeeSetter(value);
        handleValidate(currentValue, parseFloat(firstTokenSelected.amount), gasFeeValue);
    }

    const setPackageHashIfSymbolIsCSPR = (token) => {
        if (token.symbol === 'CSPR') {
            token.packageHash = CSPRPackageHash;
        }
        return token;
    }
    const handleGetChartData = async () => {
        const firstToken = setPackageHashIfSymbolIsCSPR(firstTokenSelected)
        const secondToken = setPackageHashIfSymbolIsCSPR(secondTokenSelected)

        // TODO: validate what information are OK to show
        //const priceAndPercentage = await getHistoricalTokensChartPrices(firstToken.packageHash, secondToken.packageHash)
        const priceAndPercentage = await getPercentChangeByTokens(firstToken.packageHash, secondToken.packageHash)
        // TODO: enable this when the look and feel are ready
        // const chartData = await getTokensChartData(firstToken.packageHash, secondToken.packageHash)
        const chartData = [[], []]

        if(showChart0) {
            setChartData(chartData[0])
            setPriceAndPercentage((prevState) => ({
                ...prevState,
                priceUSD: priceAndPercentage[0].priceUSD,
                percentage: priceAndPercentage[0].percentage
            }))
        } else {
            setChartData(chartData[1])
            setPriceAndPercentage((prevState) => ({
                ...prevState,
                priceUSD: priceAndPercentage[1].priceUSD,
                percentage: priceAndPercentage[1].percentage
            }))
        }
    }

    const handlesShowChart0 = () => {
        setShowChart0(true)
        setShowChart1(false)
    }

    const handleShowChart1 = () => {
        setShowChart1(true)
        setShowChart0(false)
    }

    const resetTokenValues =  () => {
        amountSwapTokenASetter(0);
        amountSwapTokenBSetter(0);
        setValueAUSD('0')
        setValueBUSD('0')
    }

    const setPriceImpact = (priceImpact = 0) => {
        priceImpactSetter(priceImpact);
        defaultPriceImpactLabelSetter(
            parseFloat(priceImpact as any) > 1
                ? 'Price Impact Warning'
                : 'Low Price Impact'
        );
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
            setPriceImpact();
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
        if (validAndCalculateCSPRToWCSPR(tokenA, tokenB, isSwitched)) {
            const pairPath = []
            pairPath.push(tokenA.symbol)
            pairPath.push(tokenB.symbol)

            priceImpactSetter('0');
            defaultPriceImpactLabelSetter(
              parseFloat('0' as any) > 1
                ? 'Price Impact Warning'
                : 'Low Price Impact'
            );

            setPlatformGas(0)

            return {tokensToTransfer: new BigNumber(value).toString(), priceImpact: '0', exchangeRateA: new BigNumber(1), exchangeRateB: new BigNumber(1), routePath: pairPath}
        }

        const {getSwapDetailResponse} = await calculateSwapDetailResponse(tokenA, tokenB, value, token, isSwitched)
        const {tokensToTransfer, priceImpact, exchangeRateA, exchangeRateB, routePath} =
            getSwapDetailResponse;

        setPriceImpact(priceImpact);

        setPlatformGas(PLATFORM_GAS_FEE)
        return {tokensToTransfer, exchangeRateA, exchangeRateB, priceImpact, routePath};
    }

    const calculateSwapDetailResponse = async (tokenA: Token, tokenB: Token, value: number, token: Token, isSwitched: boolean) => {
        const isAorB = tokenA.symbol === token.symbol
        const [param, param1] = isAorB ? [tokenA.symbol, tokenB.symbol] : [tokenB.symbol, tokenA.symbol]
        const listPath = getListPath(param, param1, Object.values(tokenState.tokens), Object.values(pairState))
        const pairExist = listPath.length == 0

        let getSwapDetailResponse = null;
        let nextTokensToTransfer = value
        let exchangeRateA = BigNumber(1)
        let exchangeRateB = BigNumber(1)

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
            exchangeRateA = getSwapDetailResponse.exchangeRateA
            exchangeRateB = getSwapDetailResponse.exchangeRateB
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
                const token1 = tokenState.tokens[symbol1]
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
                exchangeRateA = exchangeRateA.times(getSwapDetailResponse.exchangeRateA)
                exchangeRateB = exchangeRateB.times(getSwapDetailResponse.exchangeRateB)
            }
            setPairPath([...new Set(pairPath)])
        }

        if (isSwitched) {
            gasFeeSetter(adjustedGas(gasPriceSelectedForSwapping, tokenA.symbol, tokenB.symbol ,pairExist ? 0 : (listPath.length -1)))
        }

        return {
            getSwapDetailResponse: Object.assign(
              getSwapDetailResponse, 
              {
                exchangeRateA,
                exchangeRateB,
              }
            )
        }
    }

    const validAndCalculateCSPRToWCSPR = (tokenA: Token, tokenB: Token, isSwitched): boolean => {
        let isValid = false
        if (tokenA.symbol === 'CSPR' && tokenB.symbol === 'WCSPR') {
            isValid = true
        } else if (tokenA.symbol === 'WCSPR' && tokenB.symbol === 'CSPR') {
            isValid = true
        }

        if (isValid) {
            updateSlippageTolerance(0)
            setPairPath([tokenA.symbol, tokenB.symbol])
        }
        if (isSwitched) {
            updateSlippageTolerance(0.5)
            gasFeeSetter(isValid ? 9 : adjustedGas(gasPriceSelectedForSwapping, tokenA.symbol, tokenB.symbol, 0))
        }

        return isValid
    }

    return (
        <>
            <DoubleColumn isMobile={isMobile} title="Swap">
                <SwapDetail
                    firstTokenImg={firstTokenSelected.logoURI || ''}
                    secondTokenImg={secondTokenSelected.logoURI || ''}
                    firstSelectedToken={firstTokenSelected}
                    platformGasFee={platformGas}
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
                    valueAUSD={valueAUSD}
                    valueBUSD={valueBUSD}
                    setValueAUSD={setValueAUSD}
                    setValueBUSD={setValueBUSD}
                />
            </DoubleColumn>
        </>
    )
};
