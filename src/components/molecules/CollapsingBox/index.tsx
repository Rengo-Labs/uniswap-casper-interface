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

export const CollapsingBox = ({ firstToken, firstSymbolToken, receivedSymbolToken, tokensToTransfer, tokenBPrice, priceImpact }:any)  => {
    const [ isExpanded, setExpanded ] = useState(false);

    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

    function handleOnClick() {
        setExpanded(!isExpanded);
    }

    return (
        <CollapsingContainerStyled>
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
                            <CollapsingColumnRight>{tokensToTransfer} {receivedSymbolToken.symbol}</CollapsingColumnRight>
                        </CollapsingRow>
                        <CollapsingRow>
                            <CollapsingColumnLeft>Liquidity provider fee</CollapsingColumnLeft>
                            <CollapsingColumnRight>0.0% CSPR Hardcoded</CollapsingColumnRight>
                        </CollapsingRow>
                        <CollapsingRow>
                            <CollapsingRouter>
                                <CollapsingRow>
                                    <CollapsingColumnLeft>Swap router</CollapsingColumnLeft>
                                    <CollapsingColumnRight><AiFillQuestionCircle/></CollapsingColumnRight>
                                </CollapsingRow>
                                <CollapsingRow>
                                    <CollapsingColumnLeft>Route</CollapsingColumnLeft>
                                    <CollapsingColumnRight>{firstSymbolToken.symbol} {` > `} {receivedSymbolToken.symbol}</CollapsingColumnRight>
                                </CollapsingRow>
                            </CollapsingRouter>
                        </CollapsingRow>
                    </CollapsingBody>
                </div>
            </div>
        </CollapsingContainerStyled>
    );
}
