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
import { RouterBox, SlippageBox } from '../../atoms'
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

export const LPDetail = ({
    firstSymbolToken = 'CSPR',
    secondSymbolToken = 'ETH',
    secondTokenAmount = 200,
    liquidity = 10,
    firstReserve = 0.00,
    secondReserve = 0.00,
    slippage = 0.005,
    slippageSetter = () => { },
    className = '',
    fullExpanded = false,
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
                    <CollapsingColumnLeft>Base</CollapsingColumnLeft>
                    <CollapsingColumnRight>{firstSymbolToken}</CollapsingColumnRight>
                </CollapsingRow>
                <CollapsingRow>
                    <CollapsingColumnLeft>Max Amount</CollapsingColumnLeft>
                    <CollapsingColumnRight>{(secondTokenAmount * (1 - slippage / 100)).toFixed(9)} {secondSymbolToken}</CollapsingColumnRight>
                </CollapsingRow>
                <CollapsingRow>
                    <CollapsingColumnLeft>Pool Liquidity ({firstSymbolToken})</CollapsingColumnLeft>
                    <CollapsingColumnRight>{firstReserve} {firstSymbolToken}</CollapsingColumnRight>
                </CollapsingRow>
                <CollapsingRow>
                    <CollapsingColumnLeft>Pool Liquidity ({secondSymbolToken}) </CollapsingColumnLeft>
                    <CollapsingColumnRight>{secondReserve} {secondSymbolToken}</CollapsingColumnRight>
                </CollapsingRow>
                <CollapsingRow>
                    <CollapsingColumnLeft>LP supply</CollapsingColumnLeft>
                    <CollapsingColumnRight data-testid="collapsing_min_received">{liquidity} {firstSymbolToken}-{secondSymbolToken}</CollapsingColumnRight>
                </CollapsingRow>

                <CollapsingRow>
                    {/* TODO: remove inline css*/}
                    <div style={{ width: "100%" }} className="collapsible">
                        <CollapsingHeader data-testid="collapsing_id" {...getToggleProps({ onClick: handleOnClick })}>
                            {/* TODO: remove inline css*/}
                            <CollapsingRow style={{ paddingTop: "0", color: "rgba(120, 100, 244, 1)" }}>
                                more information {isExpanded ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
                            </CollapsingRow>
                        </CollapsingHeader>
                        <div {...getCollapseProps()}>
                            <CollapsingRow>
                                <SlippageBox slippageEnabled={slippageEnabled} onSlippageChange={updateSlippage} slippage={slippage} />
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
