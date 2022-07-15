import React, { useContext, useState } from 'react'
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CloseButtonAtom, HeaderModalAtom, SwapButton, SwapContainer, SwapContainerAtom, SwapHeaderAtom } from '../../atoms';
import { ConfigProviderContext } from '../../../contexts/ConfigContext';
import { SwapModal } from '../../molecules';
import { AiOutlineClose } from 'react-icons/ai';

export const SwapModulesStyled = styled.section`
    margin:10px;
    padding:20px 30px;
    border-radius: 10px;
    background-color: ${props => props.theme.StrongColor2};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    gap:1rem;
`

export const SwapTokenBalanceStyled = styled.aside`
    box-sizing: border-box;
    border-radius: 10px;
    background-color: ${props => props.theme.StrongColor2};
    width: 100%;
    display: flex;
    flex-direction: column;
    padding:.5rem;
    gap:.5rem;
`

export const LiquidityCardContainerStyled = styled.div`
    display:flex;
    flex-direction: column;
    gap:10px;
`
export const LiquidityCardHeadSectionStyled = styled.section`
    display:flex;
    justify-content:space-between;
    align-items:center;
`
export const LiquidityCardHeadTitleStyled = styled.h1``
export const LiquidityCardHeadCallToActionStyled = styled.nav``
export const LiquidityCardHeadButtonStyled = styled.button``
export const LiquidityCardFooterStyled = styled.div`
    display:grid;
    place-items: center;
`

export const LiquidityTemplate = () => {
    let navigate = useNavigate();
    const [activeModalSwap, activeModalSwapSetter] = useState(false)
    const { onConnectConfig, isConnected, cleanPairs } = useContext(ConfigProviderContext)

    function onConnect() {
        onConnectConfig()
    }



    return (
        <SwapModulesStyled>
            <SwapContainer>
                <LiquidityCardContainerStyled>
                    <LiquidityCardHeadSectionStyled>
                        <LiquidityCardHeadTitleStyled>Your Liquidity</LiquidityCardHeadTitleStyled>
                        <LiquidityCardHeadCallToActionStyled>
                            <LiquidityCardHeadButtonStyled>X</LiquidityCardHeadButtonStyled>
                            <LiquidityCardHeadButtonStyled>Y</LiquidityCardHeadButtonStyled>
                        </LiquidityCardHeadCallToActionStyled>
                    </LiquidityCardHeadSectionStyled>
                    <LiquidityCardHeadSectionStyled>
                        <LiquidityCardHeadTitleStyled>Remove liquidity to receive tokens backs</LiquidityCardHeadTitleStyled>
                    </LiquidityCardHeadSectionStyled>
                </LiquidityCardContainerStyled>
                <SwapTokenBalanceStyled>

                    {!isConnected && <>Connect your wallet first</>}
                    {isConnected && <RenderPairs pairs={cleanPairs()} callback={()=>{activeModalSwapSetter(true)}}/>}
                </SwapTokenBalanceStyled>
                <LiquidityCardFooterStyled>
                    {!isConnected && <SwapButton content="Connect to Wallet" handler={() => { onConnect() }} />}
                    {isConnected && <SwapButton content="+ Add Liquidity" handler={() => { navigate(`/liquidity/add`) }} />}
                </LiquidityCardFooterStyled>
                {activeModalSwap &&
                    <SwapModal>
                        <SwapContainerAtom >
                            <SwapHeaderAtom>
                                <HeaderModalAtom>Confirm Add Liquidity</HeaderModalAtom>
                                <CloseButtonAtom onClick={() => { activeModalSwapSetter(false) }}>
                                    <AiOutlineClose />
                                </CloseButtonAtom>
                            </SwapHeaderAtom>
                            <div>
                                otra cosa
                            </div>

                        </SwapContainerAtom>
                    </SwapModal>}
            </SwapContainer>
        </SwapModulesStyled>
    )
}


const RenderPairs = ({ pairs,callback }: any) => {
    if (pairs.length > 0) {
        return (
            <>
                {pairs.map(x => <ButtonPair key={x.toString()} pair={x} callback={()=>{callback()}}/>)}
            </>
        )
    } else {
        return (
            <div>no pairs found</div>
        )
    }

}

const ContainerStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius:10px;
    padding:.4rem;
    background-color: ${props => props.theme.StrongColor3};

`

const ShowPairStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap:10px;
`

const ButtonStyle = styled.button`
    color: ${props => props.theme.StrongColor};
    background-color: ${props => props.theme.TertiaryColor};
    padding:10px;
    border-radius: 10px;
    border:none;
    box-shadow: 0 0 1rem .2rem rgba(0,0,0,.3);
    &:hover{
        cursor: pointer;
        background-color: ${props => props.theme.TertiaryColor2};
    }
    &:active{
        background-color: ${props => props.theme.TertiaryColor3};
    }
`


const ButtonPair = ({ pair, callback }: any) => {
    return (
        <ContainerStyled>
            <ShowPairStyled>
                <div>Name: {pair.name}</div>
                <div>Balance: {pair.balance}</div>
            </ShowPairStyled>
            <ButtonStyle onClick={()=>{callback()}}>- Remove Liquidity</ButtonStyle>
        </ContainerStyled>
    )
}