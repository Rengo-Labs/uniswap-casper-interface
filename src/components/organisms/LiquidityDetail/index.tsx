import React from 'react';
import {LiquidityDetails} from 'rengo-ui-kit';
import {formatNaN} from "../../../commons";

const LiquidityDetail = ({firstSymbol, secondSymbol, baseAmount, minAmount, firstTotalLiquidity, secondTotalLiquidity, totalSupply, slippage, setSlippage, networkFee, setNetworkFee}) => {

    return (
        <>
            <LiquidityDetails
                firstSymbol={firstSymbol}
                secondSymbol={secondSymbol}
                baseAmount={(formatNaN(baseAmount) * (1 - slippage / 100)).toFixed(9)}
                minAmount={(formatNaN(minAmount) * (1 - slippage / 100)).toFixed(9)}
                firstTotalLiquidity={firstTotalLiquidity}
                secondTotalLiquidity={secondTotalLiquidity}
                totalSupply={totalSupply}
                slippage={slippage}
                networkFee={networkFee}
                setSlippage={setSlippage}
                setNetworkFee={setNetworkFee}
            />
        </>
    )
}

export default LiquidityDetail
