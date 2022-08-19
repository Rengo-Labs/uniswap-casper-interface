import React, {useState} from 'react';
import useCollapse from 'react-collapsed';
import {
    CollapsingContainerStyled,
    CollapsingRow,
    CollapsingColumnLeft,
    CollapsingColumnRight,
    CollapsingHeader,
    CollapsingBody,
    CollapsingRouter
} from './styles'
import {AiOutlineCaretDown, AiOutlineCaretUp, AiFillQuestionCircle} from "react-icons/ai";
import {RouterBox, SlippageBox} from '../../atoms'

export const CollapsingBox = ({
                                  firstToken, firstSymbolToken,
                                  receivedSymbolToken, tokensToTransfer,
                                  tokenBPrice, priceImpact,
                                  slippage, fee, className,
                                  slippageSetter
}:any)  => {
    const [ isExpanded, setExpanded ] = useState(false);

    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

    const handleOnClick = () => {
        setExpanded(!isExpanded);
    }

    const calculateMinimumTokenReceived = (tokensToTransfer, slippage) => {
        return (tokensToTransfer - tokensToTransfer*slippage/100).toFixed(8)
    }

    const updateSlippage = event => {
        slippageSetter(event.target.value)
    }

    return (
        <CollapsingContainerStyled className={className}>
            <div className="collapsible">
                <CollapsingHeader {...getToggleProps({onClick: handleOnClick})}>
                    <CollapsingRow>
                        <CollapsingColumnLeft>
                            {tokensToTransfer} {receivedSymbolToken.symbol} = {firstToken} {firstSymbolToken.symbol}
                        </CollapsingColumnLeft>
                        <CollapsingColumnRight>
                            {isExpanded ? <AiOutlineCaretUp/> : <AiOutlineCaretDown/>}
                        </CollapsingColumnRight>
                    </CollapsingRow>
                </CollapsingHeader>
                <div {...getCollapseProps()}>
                    <CollapsingBody>
                        <CollapsingRow>
                            <CollapsingColumnLeft>Price impact</CollapsingColumnLeft>
                            <CollapsingColumnRight>{priceImpact} %</CollapsingColumnRight>
                        </CollapsingRow>
                        <CollapsingRow>
                            <CollapsingColumnLeft>Expected output</CollapsingColumnLeft>
                            <CollapsingColumnRight>{tokensToTransfer} {receivedSymbolToken.symbol}</CollapsingColumnRight>
                        </CollapsingRow>
                        <CollapsingRow>
                            <CollapsingColumnLeft>Minimum received</CollapsingColumnLeft>
                            <CollapsingColumnRight>{calculateMinimumTokenReceived(tokensToTransfer, slippage)} {receivedSymbolToken.symbol}</CollapsingColumnRight>
                        </CollapsingRow>
                        <CollapsingRow>
                            <CollapsingColumnLeft>Liquidity provider fee</CollapsingColumnLeft>
                            <CollapsingColumnRight>10 CSPR</CollapsingColumnRight>
                        </CollapsingRow>
                        <SlippageBox onSlippageChange={updateSlippage} slippage={slippage} />
                        <CollapsingRow>
                            <RouterBox tokenASymbol={firstSymbolToken.symbol} tokenBSymbol={receivedSymbolToken.symbol}/>
                        </CollapsingRow>
                    </CollapsingBody>
                </div>
            </div>
        </CollapsingContainerStyled>
    );
}
