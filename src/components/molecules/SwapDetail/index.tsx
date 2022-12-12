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
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
interface SwapDetailProps {
    firstSymbolToken?:string,
    firstTokenAmount?:number,
    secondSymbolToken?:string,
    secondTokenAmount?:number,
    priceImpact?:number,
    priceImpactMessage?:string,
    slippage?:number,
    slippageSetter?(any):void,
    className?:string,
    fullExpanded?:boolean,
    slippageEnabled?:boolean
}
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
}: SwapDetailProps) => {
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
                    <CollapsingColumnLeft>Swapping Through</CollapsingColumnLeft>
                    <CollapsingColumnRight>Casper Pool</CollapsingColumnRight>
                </CollapsingRow>
                <CollapsingRow>
                    <CollapsingColumnLeft>Minimum received</CollapsingColumnLeft>
                    <CollapsingColumnRight data-testid="collapsing_min_received">{calculateMinimumTokenReceived(secondTokenAmount, slippage)} {secondSymbolToken}</CollapsingColumnRight>
                </CollapsingRow>
                <CollapsingRow>
                    <CollapsingColumnLeft>
                        {/* TODO: remove inline css*/}
                        <PriceImpactLabel priceImpactTitle={priceImpactMessage} priceImpact={priceImpact} style={{ justifyContent: "flex-start" }} />
                    </CollapsingColumnLeft>
                    <CollapsingColumnRight data-testid="collapsing_column_right_id">
                        {/* TODO: remove inline css*/}
                        <PriceImpactLabel priceImpactTitle={priceImpact + ' %'} priceImpact={priceImpact} style={{ justifyContent: "flex-end" }} />
                    </CollapsingColumnRight>
                </CollapsingRow>
                <CollapsingRow>
                    {/* TODO: remove inline css*/}
                    <div style={{ width: "100%" }} className="collapsible">
                        <CollapsingHeader data-testid="collapsing_id" {...getToggleProps({ onClick: handleOnClick })}>
                            {/* TODO: remove inline css*/}
                            <CollapsingRow style={{ paddingTop: "0", color: "rgba(120, 100, 244, 1)" }}>
                                More information {isExpanded ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
                            </CollapsingRow>
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
