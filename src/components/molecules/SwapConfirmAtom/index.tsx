import styled from 'styled-components'
import { AiOutlineArrowDown } from "react-icons/ai";
import {CollapsingBox} from "../CollapsingBox";
import React from "react";



const ContainerStyled = styled.div`
    display:grid;
    gap:10px;
`

const BorderStyled = styled.div`
`

const TokenStyled = styled.div`
`


const ContainerTokenStyled = styled.div`
    padding: 10px;
`

const LinerTokenStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const InnerTokenStyled = styled.div`
    display: flex;
    align-items: center;
    gap:10px;
`

export const SwapConfirmAtom = ({
                                    firstToken,
                                    firstTokenSelected,
                                    secondTokenSelected,
                                    children,
                                    amountSwapTokenA,
                                    amountSwapTokenB,
                                    slippSwapToken,
                                    tokensToTransfer,
                                    priceImpact,
                                    defaultPriceImpactLabel,
                                    slippSwapTokenSetter,
                                    liquidity=false
                                }: any) => {
    return (
        <ContainerStyled>
            <BorderStyled>
                <TokenStyled>
                    <Tokens Token={firstTokenSelected} amoutSwapToken={amountSwapTokenA} />
                </TokenStyled>
                <div style={{ marginLeft: "50%" }}><AiOutlineArrowDown></AiOutlineArrowDown></div>
                <TokenStyled>
                    <Tokens Token={secondTokenSelected} amoutSwapToken={amountSwapTokenB} />
                </TokenStyled>
            </BorderStyled>
            <CollapsingBox firstToken={firstToken}
                           firstSymbolToken={firstTokenSelected}
                           receivedSymbolToken={secondTokenSelected}
                           tokensToTransfer={tokensToTransfer}
                           priceImpact={priceImpact}
                           slippage={slippSwapToken}
                           defaultPriceImpact={defaultPriceImpactLabel}
                           slippageSetter={slippSwapTokenSetter}
            />
            {!liquidity && <div>output is estimated. you will receive at least {slippSwapToken} {secondTokenSelected.symbol} or the transaction will revert</div>}
            {liquidity && <div>you will receive at least {slippSwapToken} {secondTokenSelected.symbol}-{firstTokenSelected.symbol}-LP token or the transaction will revert</div>}
            <div style={{ marginLeft: "20%" }}>{children}</div>

        </ContainerStyled>
    )
}


const Tokens = ({ Token, amoutSwapToken }) => {
    return (
        <ContainerTokenStyled>
            <LinerTokenStyled>
                <InnerTokenStyled>
                    <img src={Token.logoURI} width="50" height="50" />
                    <p>{amoutSwapToken}</p>
                </InnerTokenStyled>

                <p>{Token.name} </p>

            </LinerTokenStyled>

        </ContainerTokenStyled>
    )
}
