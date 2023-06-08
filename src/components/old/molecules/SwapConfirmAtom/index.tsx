import styled from 'styled-components'
import { AiOutlineArrowDown } from "react-icons/ai";
import {CollapsingBox} from "../CollapsingBox";
import { ContainerSCA, ContainerTokenSCA, InnerTokenSCA, LinerTokenSCA } from '../../atoms';
import { TokensSCA } from '../../organisms';
import { Token } from '../../../../commons';
interface SwapConfirmAtomProps {
    firstToken:number,
    firstTokenSelected:Token,
    secondTokenSelected:Token,
    children:React.ReactNode,
    amountSwapTokenA:number,
    amountSwapTokenB:number,
    slippSwapToken:any,
    tokensToTransfer:number,
    priceImpact:number,
    defaultPriceImpactLabel:string,
    slippSwapTokenSetter: (any) => void,
    liquidity:boolean
}


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
                                }: SwapConfirmAtomProps) => {
    return (
        <ContainerSCA>
            <div>
                <div>
                    <TokensSCA Token={firstTokenSelected} amoutSwapToken={amountSwapTokenA} />
                </div>

                <div style={{ marginLeft: "50%" }}><AiOutlineArrowDown></AiOutlineArrowDown></div>
                <div>
                    <TokensSCA Token={secondTokenSelected} amoutSwapToken={amountSwapTokenB} />
                </div>
            </div>
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
            {/* TODO: remove inline css*/}
            <div style={{ marginLeft: "20%" }}>{children}</div>

        </ContainerSCA>
    )
}
