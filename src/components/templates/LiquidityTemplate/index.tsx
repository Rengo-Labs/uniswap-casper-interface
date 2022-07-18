import React, { useContext, useState } from 'react'
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CloseButtonAtom, ConfigModalBody, HeaderModalAtom, PillowDiv, SwapButton, SwapContainer, SwapContainerAtom, SwapHeaderAtom, WalletSelectionDiv } from '../../atoms';
import { ConfigProviderContext } from '../../../contexts/ConfigContext';
import { SwapModal } from '../../molecules';
import { AiOutlineClose } from 'react-icons/ai';
import { WalletSelectionImageStyled } from '../../molecules/ConfigModal/styles';

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
    const { onConnectConfig, isConnected, cleanPairs, onDecreaseAllow, onAllowanceAgaintPair,slippageTolerance,onSetSlippage,
        onAddLiquidity, } = useContext(ConfigProviderContext)


    function onConnect() {
        onConnectConfig()
    }

    async function onDecreaseModal(pair) {
        //console.log(JSON.stringify(pair))
        if (await onDecreaseAllow(1)) {
            await onAllowanceAgaintPair(pair)
        }
    }

    return (
        <SwapModulesStyled>
            <SwapContainer>
                <LiquidityCardContainerStyled>
                    <LiquidityCardHeadSectionStyled>
                        <LiquidityCardHeadTitleStyled>Your Liquidity</LiquidityCardHeadTitleStyled>
                        <LiquidityCardHeadCallToActionStyled>
                            <LiquidityCardHeadButtonStyled onClick={() => { activeModalSwapSetter(true) }}>X</LiquidityCardHeadButtonStyled>
                            <LiquidityCardHeadButtonStyled>Y</LiquidityCardHeadButtonStyled>
                        </LiquidityCardHeadCallToActionStyled>
                    </LiquidityCardHeadSectionStyled>
                    <LiquidityCardHeadSectionStyled>
                        <LiquidityCardHeadTitleStyled>Remove liquidity to receive tokens backs</LiquidityCardHeadTitleStyled>
                    </LiquidityCardHeadSectionStyled>
                </LiquidityCardContainerStyled>
                <SwapTokenBalanceStyled>

                    {!isConnected && <>Connect your wallet first</>}
                    {isConnected && <RenderPairs pairs={cleanPairs()} callback={onDecreaseModal} />}
                </SwapTokenBalanceStyled>
                <LiquidityCardFooterStyled>
                    {!isConnected && <SwapButton content="Connect to Wallet" handler={() => { onConnect() }} />}
                    {isConnected && <SwapButton content="+ Add Liquidity" handler={() => { navigate(`/liquidity/add`) }} />}
                </LiquidityCardFooterStyled>
                {activeModalSwap &&
                    <SwapModal>
                        <SwapContainerAtom >
                            <SwapHeaderAtom>
                                <HeaderModalAtom>Transaction Settings</HeaderModalAtom>
                                <CloseButtonAtom onClick={() => { activeModalSwapSetter(false) }}>
                                    <AiOutlineClose />
                                </CloseButtonAtom>
                            </SwapHeaderAtom>
                            <ConfigModalBody>
                                <PillowDiv>
                                    Language Selection
                                </PillowDiv>
                                <PillowDiv>
                                    Visual Mode
                                </PillowDiv>
                                <PillowDiv>
                                    Slippage Tolerance
                                    <ButtonStyle style={{ backgroundColor: `${slippageTolerance === "0.1" ? "red" : ""}` }} onClick={() => { onSetSlippage("0.1") }} >0.1%</ButtonStyle>
                                    <ButtonStyle style={{ backgroundColor: `${slippageTolerance === "0.5" ? "red" : ""}` }} onClick={() => { onSetSlippage("0.5") }} >0.5%</ButtonStyle>
                                    <ButtonStyle style={{ backgroundColor: `${slippageTolerance === "1.0" ? "red" : ""}` }} onClick={() => { onSetSlippage("1.0") }} >1.0%</ButtonStyle>
                                </PillowDiv>
                                <PillowDiv>
                                    Transaction Speed
                                </PillowDiv>
                            </ConfigModalBody>

                        </SwapContainerAtom>
                    </SwapModal>}
            </SwapContainer>
        </SwapModulesStyled>
    )
}


const RenderPairs = ({ pairs, callback }: any) => {
    if (pairs.length > 0) {
        return (
            <>
                {pairs.map(x => <ButtonPair key={x.toString()} pair={x} callback={callback} />)}
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
            <ButtonStyle onClick={() => { callback(pair.id) }}>- Remove Liquidity</ButtonStyle>
        </ContainerStyled>
    )
}