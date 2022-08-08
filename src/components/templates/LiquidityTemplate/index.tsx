import React, { useContext, useState } from 'react'
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button, CloseButtonAtom, ConfigModalBody, HeaderModalAtom, PillowDiv, SwapButton, SwapContainer, SwapContainerAtom, SwapHeaderAtom, WalletSelectionDiv } from '../../atoms';
import { ConfigProviderContext } from '../../../contexts/ConfigContext';
import { SwapModal } from '../../molecules';
import { AiOutlineClose,AiFillSetting } from 'react-icons/ai';
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
    const [activeModalLiquidity, activeModalLiquiditySetter] = useState(false)
    const [activePair, activePairSetter] = useState({ name: "", balance: "" })
    const { onConnectConfig, isConnected, cleanPairs, onDecreaseAllow, onAllowanceAgaintPair, slippageTolerance, onSetSlippage,
        onAddLiquidity, onRemoveLiquidity } = useContext(ConfigProviderContext)
    const [removeValue, removeValueSetter] = useState(0)
    const [enableRemove, enableRemoveSetter] = useState(true)

    function onConnect() {
        onConnectConfig()
    }

    async function onDecreaseModal(pair) {
        activePairSetter(pair)
        activeModalLiquiditySetter(true)
    }

    async function onDecrease(pair) {
        activePairSetter(pair)
        await onRemoveLiquidity(pair)
    }

    async function onDescreaseEnable(pair) {
        activePairSetter(pair)
        if (await onDecreaseAllow(1)) {
            enableRemoveSetter(false)
        }
    }

    return (
        <SwapModulesStyled>
            <SwapContainer>
                <LiquidityCardContainerStyled>
                    <LiquidityCardHeadSectionStyled>
                        <LiquidityCardHeadTitleStyled>Your Liquidity</LiquidityCardHeadTitleStyled>
                        <LiquidityCardHeadCallToActionStyled>
                            <Button handler={() => { activeModalSwapSetter(true) }} content={<AiFillSetting size="1.5em" />} />
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
                                    <div style={{display:"flex",gap: "10px"}}>
                                    <ButtonStyle style={{ backgroundColor: `${slippageTolerance === "0.1" ? "red" : ""}` }} onClick={() => { onSetSlippage("0.1") }} >0.1%</ButtonStyle>
                                    <ButtonStyle style={{ backgroundColor: `${slippageTolerance === "0.5" ? "red" : ""}` }} onClick={() => { onSetSlippage("0.5") }} >0.5%</ButtonStyle>
                                    <ButtonStyle style={{ backgroundColor: `${slippageTolerance === "1.0" ? "red" : ""}` }} onClick={() => { onSetSlippage("1.0") }} >1.0%</ButtonStyle>
                                    </div>
                                </PillowDiv>
                                <PillowDiv>
                                    Transaction Speed
                                </PillowDiv>
                            </ConfigModalBody>

                        </SwapContainerAtom>
                    </SwapModal>}
                {activeModalLiquidity &&
                    <SwapModal>
                        <SwapContainerAtom >
                            <SwapHeaderAtom>
                                <HeaderModalAtom>Remove {activePair.name} liquidity </HeaderModalAtom>
                                <CloseButtonAtom onClick={() => { activeModalLiquiditySetter(false) }}>
                                    <AiOutlineClose />
                                </CloseButtonAtom>
                            </SwapHeaderAtom>
                            <ConfigModalBody>
                                <PillowDiv>
                                    <LiquidityHandler>
                                        <LiquidityHeader>
                                            <p>amount</p>
                                            <p>you have: {activePair.balance}</p>
                                        </LiquidityHeader>
                                        <LiquidityBarSection>
                                            <ProgressBar max={activePair.balance} value={removeValue} onChange={(e) => { removeValueSetter(e.target.value) }} />
                                            <LiquidityButtons>
                                                <SwapButton content="25%" handler={() => { removeValueSetter(parseInt(activePair.balance) * 0.25) }} />
                                                <SwapButton content="50%" handler={() => { removeValueSetter(parseInt(activePair.balance) * 0.5) }} />
                                                <SwapButton content="75%" handler={() => { removeValueSetter(parseInt(activePair.balance) * 0.75) }} />
                                                <SwapButton content="MAX" handler={() => { removeValueSetter(parseInt(activePair.balance)) }} />
                                            </LiquidityButtons>
                                        </LiquidityBarSection>
                                    </LiquidityHandler>
                                </PillowDiv>
                            </ConfigModalBody>
                            <ConfigModalBody>
                                <PillowDiv>
                                    <LiquidityHandler>
                                        <p>Receive</p>
                                        <div>
                                            <CallToAction>
                                                <p>WCSPR:</p>
                                                <p>{removeValue / 0.037762211852053015}</p>
                                            </CallToAction>
                                            <CallToAction>
                                                <p>WETH:</p>
                                                <p>{removeValue}</p>
                                            </CallToAction>
                                        </div>
                                    </LiquidityHandler>
                                </PillowDiv>
                            </ConfigModalBody>
                            <ConfigModalBody>
                                <PillowDiv>
                                    <LiquidityHandler>
                                        <p>Slippage Tolerance: {slippageTolerance}</p>
                                        <LiquidityButtons>
                                            <SwapButton content="Enable" handler={async () => { await onDescreaseEnable(1) }} />
                                            <SwapButton content="Remove" handler={async () => { await onDecrease(1) }} disabled={enableRemove} />
                                        </LiquidityButtons>
                                    </LiquidityHandler>
                                </PillowDiv>
                            </ConfigModalBody>
                        </SwapContainerAtom>
                    </SwapModal>}
            </SwapContainer>
        </SwapModulesStyled>
    )
}

function CallToAction({ children }) {
    return (<CallToActionStyled>{children}</CallToActionStyled>)
}

const CallToActionStyled = styled.div`
    width: 100%;
    display:flex;
    justify-content: space-between;
`

function LiquidityHandler({ children }) {
    return (<LiquidityHandlerStyled>{children}</LiquidityHandlerStyled>)
}

const LiquidityHandlerStyled = styled.div`
    width: 100%;
    display:grid;
    gap:10px;
`

function LiquidityHeader({ children }) {
    return (<LiquidityHeaderStyled>{children}</LiquidityHeaderStyled>)
}

const LiquidityHeaderStyled = styled.div`
    display:flex;
    justify-content: space-between;
`
function ProgressBar({ max, value, onChange }) {
    return (<ProgressBarStyled type="range" min="0" max={parseInt(max)} value={value} step="0.1" onChange={onChange} />)
}

const ProgressBarStyled = styled.input`
    width: 100%;
`

function LiquidityButtons({ children }) {
    return (<LiquidityButtonsStyled>{children}</LiquidityButtonsStyled>)
}

const LiquidityButtonsStyled = styled.div`
    display:flex;
    justify-content: space-between;
    gap:10px;
`

function LiquidityBarSection({ children }) {
    return (<LiquidityBarSectionStyled>{children}</LiquidityBarSectionStyled>)
}

const LiquidityBarSectionStyled = styled.div`
    padding:0 10px;
    display:flex;
    flex-direction: column;
    gap:10px;
`

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
            <ButtonStyle onClick={() => { callback(pair) }}>- Remove Liquidity</ButtonStyle>
        </ContainerStyled>
    )
}