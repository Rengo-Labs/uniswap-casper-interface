import React from 'react';
import {SwapTabs} from 'rengo-ui-kit';

interface SwapDetailProps {
    firstTokenImg: string;
    secondTokenImg: string;
    firstSelectedToken: any;
    platformGasFee: number;
    secondSelectedToken: any;
    slippageTolerance: number;
    calculateMinimumTokenReceived: any;
    firstSymbolToken: string,
    firstTokenAmount: number,
    networkGasFee: any,
    networkGasFeeSetter: any,
    pairPath: any[],
    priceImpact: string|number,
    priceImpactMessage: string,
    secondSymbolToken: string,
    secondTokenAmount: number,
    slippageSetter: any
    chartData: any[]
    xAxisName: string
    todayPrice: string
    yesterdayPrice: string
    chart0Name: string
    chart1Name: string
    onClickButton0: () => void
    onClickButton1: () => void
    showChart0: boolean
    showChart1: boolean
}

const SwapDetail = ({
                        firstTokenImg,
                        secondTokenImg,
                        firstSelectedToken,
                        platformGasFee,
                        secondSelectedToken,
                        slippageTolerance,
                        calculateMinimumTokenReceived,
                        firstSymbolToken,
                        firstTokenAmount,
                        networkGasFee,
                        networkGasFeeSetter,
                        pairPath,
                        priceImpact,
                        priceImpactMessage,
                        secondSymbolToken,
                        secondTokenAmount,
                        slippageSetter,
                        chartData,
                        xAxisName,
                        todayPrice,
                        yesterdayPrice,
                        chart0Name,
                        chart1Name,
                        onClickButton0,
                        onClickButton1,
                        showChart0,
                        showChart1
                    }: SwapDetailProps) => {
    const container = document.getElementById('swap-tabs');
  return (
        <>
            <SwapTabs
                firstTokenImg={firstTokenImg}
                secondTokenImg={secondTokenImg}
                firstSelectedToken={firstSelectedToken}
                platformGasFee={platformGasFee}
                secondSelectedToken={secondSelectedToken}
                slippageTolerance={slippageTolerance}
                calculateMinimumTokenReceived={calculateMinimumTokenReceived}
                firstSymbolToken={firstSymbolToken}
                firstTokenAmount={firstTokenAmount}
                networkGasFee={networkGasFee}
                networkGasFeeSetter={networkGasFeeSetter}
                pairPath={pairPath}
                priceImpact={priceImpact}
                priceImpactMessage={priceImpactMessage}
                secondSymbolToken={secondSymbolToken}
                secondTokenAmount={secondTokenAmount}
                slippageSetter={slippageSetter}
                //chart
                graphicData={chartData}
                todayPrice={todayPrice}
                yesterdayPrice={yesterdayPrice}
                xAxisName={xAxisName}
                chart0Name={chart0Name}
                chart1Name={chart1Name}
                onClickButton0={onClickButton0}
                onClickButton1={onClickButton1}
                showChart0={showChart0}
                showChart1={showChart1}
                charWidth={container?.clientWidth}
                charHeight={225}
                tabDefault={2}
                editableSlippage={!(firstSymbolToken === 'CSPR' && secondSymbolToken === 'WCSPR' || firstSymbolToken === 'WCSPR' && secondSelectedToken === 'CSPR')}
                />
        </>
    )
}

export default SwapDetail
