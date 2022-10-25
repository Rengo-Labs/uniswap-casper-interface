import React, {useState} from 'react';
import useCollapse from 'react-collapsed';
import {
    CollapsingContainerStyled,
    CollapsingRow,
    CollapsingColumnLeft,
    CollapsingColumnRight,
    CollapsingHeader,
    CollapsingBody
} from './styles'
import {RouterBox, SlippageBox} from '../../atoms'

export const LPDetail = ({
                             firstSymbolToken = 'CSPR',
                             firstTokenAmount = 10,
                             secondSymbolToken = 'ETH',
                             secondTokenAmount = 200,
                             liquidity = 10,
                             slippage = 0.005,
                             slippageSetter = () => {},
                             className = '',
                             fullExpanded = false,
                             slippageEnabled = false
                    }:any)  => {
    const [ isExpanded, setExpanded ] = useState(fullExpanded);

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
                    <CollapsingColumnRight>CSPR</CollapsingColumnRight>
                </CollapsingRow>
                <CollapsingRow>
                    <CollapsingColumnLeft>Pool Liquidity ({firstSymbolToken})</CollapsingColumnLeft>
                    <CollapsingColumnRight>{firstTokenAmount} {firstSymbolToken}</CollapsingColumnRight>
                </CollapsingRow>
                <CollapsingRow>
                    <CollapsingColumnLeft>Pool Liquidity ({secondSymbolToken}) </CollapsingColumnLeft>
                    <CollapsingColumnRight>{secondTokenAmount} {secondSymbolToken}</CollapsingColumnRight>
                </CollapsingRow>
                <CollapsingRow>
                    <CollapsingColumnLeft>LP supply</CollapsingColumnLeft>
                    <CollapsingColumnRight data-testid="collapsing_min_received">{liquidity} {firstSymbolToken}-{secondSymbolToken}</CollapsingColumnRight>
                </CollapsingRow>

                <CollapsingRow>
                    <div style={{width: "100%"}} className="collapsible">
                        <CollapsingHeader data-testid="collapsing_id" {...getToggleProps({onClick: handleOnClick})}>
                            <CollapsingRow style={{color: "rgba(120, 100, 244, 1)"}}>more information</CollapsingRow>
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
                                <RouterBox tokenASymbol={firstSymbolToken} tokenBSymbol={secondSymbolToken}/>
                            </CollapsingRow>
                        </div>
                    </div>
                </CollapsingRow>
            </CollapsingBody>
        </CollapsingContainerStyled>
    );
}
