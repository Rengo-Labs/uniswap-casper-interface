import React, { useState } from 'react';
import useCollapse from 'react-collapsed';
import {
    CollapsingContainerStyled,
    CollapsingRow,
    CollapsingColumnLeft,
    CollapsingColumnRight,
    CollapsingHeader,
    CollapsingBody
} from './styles'
import { AiOutlineCaretDown } from "react-icons/ai";
import { RouterBox, SlippageBox } from '../../atoms'
import { PriceImpactLabel } from "../../atoms/ExchangeRateBox/styles";

import { calculateMinimumTokenReceived } from '../../../contexts/PriceImpactContext'

export const SwapDetail = ({
    firstSymbolToken = 'CSPR',
    firstTokenAmount = 10,
    secondSymbolToken = 'ETH',
    secondTokenAmount = 200,
    priceImpact = 1.5,
    priceImpactMessage = 'Title',
    slippage = 0.005,
    slippageSetter = () => { },
    className = '',
    fullExpanded = true,
    slippageEnabled = false
}: any) => {
    const [isExpanded, setExpanded] = useState(fullExpanded);

    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

    const handleOnClick = () => {
        setExpanded(!isExpanded);
    }

    const updateSlippage = event => {
        slippageSetter(event.target.value)
    }

    return (
        <CollapsingContainerStyled className={className}>
            <CollapsingBody>
                <CollapsingRow>
                    <CollapsingColumnLeft>
                        <PriceImpactLabel priceImpactTitle={priceImpactMessage} priceImpact={priceImpact} style={{ justifyContent: "flex-start" }} />
                    </CollapsingColumnLeft>
                    <CollapsingColumnRight data-testid="collapsing_column_right_id">
                        {
                            !isExpanded && `${firstSymbolToken}`
                        }
                        {
                            isExpanded && <PriceImpactLabel priceImpactTitle={priceImpact + ' %'} priceImpact={priceImpact} style={{ justifyContent: "flex-end" }} />
                        }
                        {
                            isExpanded ? '' : <AiOutlineCaretDown />
                        }
                    </CollapsingColumnRight>
                </CollapsingRow>
                <CollapsingRow>
                    <CollapsingColumnLeft>Expected output</CollapsingColumnLeft>
                    <CollapsingColumnRight>{secondTokenAmount} {secondSymbolToken}</CollapsingColumnRight>
                </CollapsingRow>
                <CollapsingRow>
                    <CollapsingColumnLeft>Minimum received</CollapsingColumnLeft>
                    <CollapsingColumnRight data-testid="collapsing_min_received">{calculateMinimumTokenReceived(secondTokenAmount, slippage)} {secondSymbolToken}</CollapsingColumnRight>
                </CollapsingRow>

                <CollapsingRow>
                    <div style={{ width: "100%" }} className="collapsible">
                        <CollapsingHeader data-testid="collapsing_id" {...getToggleProps({ onClick: handleOnClick })}>
                            <CollapsingRow style={{ color: "rgba(120, 100, 244, 1)" }}>more information</CollapsingRow>
                        </CollapsingHeader>
                        <div {...getCollapseProps()}>
                            <CollapsingRow>
                                <SlippageBox slippageEnabled={slippageEnabled} onSlippageChange={updateSlippage} slippage={slippage} />
                            </CollapsingRow>
                            <CollapsingRow>
                                <CollapsingColumnLeft>Swap fee</CollapsingColumnLeft>
                                <CollapsingColumnRight>{firstTokenAmount * 0.003} CSPR</CollapsingColumnRight>
                            </CollapsingRow>
                            <CollapsingRow>
                                <CollapsingColumnLeft>Network gas fee</CollapsingColumnLeft>
                                <CollapsingColumnRight>10 CSPR</CollapsingColumnRight>
                            </CollapsingRow>
                            <CollapsingRow>
                                <RouterBox tokenASymbol={firstSymbolToken} tokenBSymbol={secondSymbolToken} />
                            </CollapsingRow>
                        </div>
                    </div>
                </CollapsingRow>
            </CollapsingBody>
        </CollapsingContainerStyled>
    );
}
