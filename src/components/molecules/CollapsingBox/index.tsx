import React, {useContext, useState} from 'react';
import useCollapse from 'react-collapsed';
import {
    CollapsingContainerStyled,
    CollapsingRow,
    CollapsingColumnLeft,
    CollapsingColumnRight,
    CollapsingHeader,
    CollapsingBody
} from './styles'
import {AiOutlineCaretDown, AiOutlineCaretUp} from "react-icons/ai";
import {RouterBox, SlippageBox} from '../../atoms'
import {PriceImpactLabel} from "../../atoms/ExchangeRateBox/styles";

import { ConfigProviderContext } from '../../../contexts/ConfigContext'

export const CollapsingBox = ({
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
    const { calculateMinimumTokenReceived } = useContext(ConfigProviderContext)
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
                    <CollapsingHeader {...getToggleProps({onClick: handleOnClick})}>
                        <CollapsingRow>
                            <CollapsingColumnLeft>
                                {
                                    !isExpanded &&
                                    <PriceImpactLabel priceImpactTitle={defaultPriceImpact} priceImpact={priceImpact}/>
                                }
                            </CollapsingColumnLeft>
                            <CollapsingColumnRight>
                                {!isExpanded && priceImpact + ' %'} {isExpanded ? <AiOutlineCaretUp/> :
                                <AiOutlineCaretDown/>}
                            </CollapsingColumnRight>
                        </CollapsingRow>
                    </CollapsingHeader>
                }
                <div {...getCollapseProps()}>
                    <CollapsingBody>
                        <CollapsingRow>
                            <CollapsingColumnLeft>Price impact</CollapsingColumnLeft>
                            <CollapsingColumnRight>{priceImpact} %</CollapsingColumnRight>
                        </CollapsingRow>
                        <CollapsingRow>
                            <CollapsingColumnLeft>Minimum received</CollapsingColumnLeft>
                            <CollapsingColumnRight>{calculateMinimumTokenReceived(tokensToTransfer, slippage)} {receivedSymbolToken.symbol}</CollapsingColumnRight>
                        </CollapsingRow>
                        <SlippageBox slippageEnabled={slippageEnabled} onSlippageChange={updateSlippage} slippage={slippage} />
                        <CollapsingRow>
                            <CollapsingColumnLeft>Expected output</CollapsingColumnLeft>
                            <CollapsingColumnRight>{tokensToTransfer} {receivedSymbolToken.symbol}</CollapsingColumnRight>
                        </CollapsingRow>
                        <CollapsingRow>
                            <CollapsingColumnLeft>Liquidity provider fee</CollapsingColumnLeft>
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
