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
                        slippageSetter
                    }: SwapDetailProps) => {
    // TODO we need to get all the information and connect with the components
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
            />
        </>
    )
}

export default SwapDetail
