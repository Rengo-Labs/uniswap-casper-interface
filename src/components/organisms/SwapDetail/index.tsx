import React from 'react';
import {SwapTabs} from 'rengo-ui-kit';

interface SwapDetailProps {
    firstTokenImg: string;
    secondTokenImg: string;
    firstSelectedToken: any;
    gasFee: number;
    secondSelectedToken: any;
    slippageTolerance: number;
    calculateMinimumTokenReceived: any;
    firstSymbolToken: string,
    firstTokenAmount: number,
    gasFeeSetter: any,
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
                        gasFee,
                        secondSelectedToken,
                        slippageTolerance,
                        calculateMinimumTokenReceived,
                        firstSymbolToken,
                        firstTokenAmount,
                        gasFeeSetter,
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
                gasFee={gasFee}
                secondSelectedToken={secondSelectedToken}
                slippageTolerance={slippageTolerance}
                calculateMinimumTokenReceived={calculateMinimumTokenReceived}
                firstSymbolToken={firstSymbolToken}
                firstTokenAmount={firstTokenAmount}
                gasFeeSetter={gasFeeSetter}
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
