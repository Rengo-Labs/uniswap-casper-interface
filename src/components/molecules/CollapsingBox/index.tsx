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
import {AiOutlineCaretDown} from "react-icons/ai";
import {RouterBox, SlippageBox} from '../../atoms'
import {PriceImpactLabel} from "../../atoms/ExchangeRateBox/styles";

import { calculateMinimumTokenReceived } from '../../../contexts/PriceImpactContext'

export const CollapsingBox = ({
                                  firstToken,
                                  firstSymbolToken,
                                  receivedSymbolToken,
                                  tokensToTransfer,
                                  priceImpact,
                                  slippage,
                                  defaultPriceImpact,
                                  slippageSetter,
                                  className,
                                  fullWidth = false,
                                  fullExpanded = true,
                                  expandedEnabled = false,
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
        <CollapsingContainerStyled fullWidth={fullWidth} className={className}>
            <div className="collapsible">
                {
                    expandedEnabled &&
                    <CollapsingHeader data-testid="collapsing_id" {...getToggleProps({onClick: handleOnClick})}>
                        <CollapsingRow>
                            <CollapsingColumnLeft>
                                <PriceImpactLabel priceImpactTitle={defaultPriceImpact} priceImpact={priceImpact} style={{justifyContent: "flex-start"}}/>
                            </CollapsingColumnLeft>
                            <CollapsingColumnRight data-testid="collapsing_column_right_id">
                                {
                                    !isExpanded && ' 10 CSPR '
                                }
                                {
                                    isExpanded && <PriceImpactLabel priceImpactTitle={priceImpact + ' %'} priceImpact={priceImpact} style={{justifyContent: "flex-end"}}/>
                                }
                                {
                                    isExpanded ? '' : <AiOutlineCaretDown/>
                                }
                            </CollapsingColumnRight>
                        </CollapsingRow>
                    </CollapsingHeader>
                }
                <div {...getCollapseProps()}>
                    <CollapsingBody>
                        {
                            !expandedEnabled &&
                            <CollapsingRow>
                                <CollapsingColumnLeft><PriceImpactLabel priceImpactTitle={defaultPriceImpact} priceImpact={priceImpact}/></CollapsingColumnLeft>
                                <CollapsingColumnRight><PriceImpactLabel priceImpactTitle={priceImpact + ' %'} priceImpact={priceImpact} style={{justifyContent: "flex-end"}}/></CollapsingColumnRight>
                            </CollapsingRow>
                        }
                        <CollapsingRow>
                            <CollapsingColumnLeft>Expected output</CollapsingColumnLeft>
                            <CollapsingColumnRight>{tokensToTransfer} {receivedSymbolToken.symbol}</CollapsingColumnRight>
                        </CollapsingRow>
                        <CollapsingRow>
                            <CollapsingColumnLeft>Minimum received</CollapsingColumnLeft>
                            <CollapsingColumnRight data-testid="collapsing_min_received">{calculateMinimumTokenReceived(tokensToTransfer, slippage)} {receivedSymbolToken.symbol}</CollapsingColumnRight>
                        </CollapsingRow>
                        <SlippageBox slippageEnabled={slippageEnabled} onSlippageChange={updateSlippage} slippage={slippage} />
                        <CollapsingRow>
                            <CollapsingColumnLeft>Swap fee</CollapsingColumnLeft>
                            <CollapsingColumnRight>{firstToken * 0.003} CSPR</CollapsingColumnRight>
                        </CollapsingRow>
                        <CollapsingRow>
                            <CollapsingColumnLeft>Network gas fee</CollapsingColumnLeft>
                            <CollapsingColumnRight>10 CSPR</CollapsingColumnRight>
                        </CollapsingRow>
                        <CollapsingRow>
                            <RouterBox tokenASymbol={firstSymbolToken.symbol} tokenBSymbol={receivedSymbolToken.symbol}/>
                        </CollapsingRow>
                    </CollapsingBody>
                </div>
            </div>
        </CollapsingContainerStyled>
    );
}
