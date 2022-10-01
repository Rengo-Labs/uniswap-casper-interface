import React, { useContext, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import styled from 'styled-components'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import { ButtonConnection, CloseButtonAtom, HeaderModalAtom, SearchInputAtom, SearchSectionAtom, SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect } from '../../atoms'
import { SwapContainerStyled } from '../../atoms/SwapContainerAtom'
import { SwapModal, SwapToken, SwapTokens } from '../../molecules'

const SwapNewModule = () => {
    const [activeModalPrimary, setActiveModalPrimary] = React.useState(false)
    const [activeModalSecondary, setActiveModalSecondary] = React.useState(false)
    const [activeModalSwap, setActiveModalSwap] = React.useState(false)
    const [amountSwapTokenA, amountSwapTokenASetter] = useState<any>(0)
    const [amountSwapTokenB, amountSwapTokenBSetter] = useState<any>(0)
    const [slippSwapToken, slippSwapTokenSetter] = useState<any>(0.5)
    const [tokensToTransfer, tokensToTransferSetter] = useState<any>(0)
    const [priceImpact, priceImpactSetter] = useState<any>(0)
    const [feeToPay, feeToPaySetter] = useState<any>(0.03)
    const [exchangeRateA, exchangeRateASetter] = useState<any>(0)
    const [exchangeRateB, exchangeRateBSetter] = useState<any>(0)
    const [defaultPriceImpactLabel, defaultPriceImpactLabelSetter] = useState<any>('')
    const [switchMovement, switchMovementSetter] = useState(false)
    const [isApprovedToken, isApprovedTokenSetter] = useState(false)
    const {
        onConnectConfig,
        configState,
        tokenState,
        onSelectFirstToken,
        onSelectSecondToken,
        onSwitchTokens,
        tokens,
        firstTokenSelected,
        secondTokenSelected,
        isConnected,
        onConfirmSwapConfig,
        slippageToleranceSelected,
        onCalculateReserves,
        getSwapDetail,
        onIncreaseAllow,
        onDisconnectWallet,
        ResetTokens,
        onListenerFirstInput
    } = useContext(ConfigProviderContext)
    const {
        walletAddress
    } = configState

    async function onConnect() {
        onConnectConfig()
    }
    async function onDisconnect() {
        onDisconnectWallet()
    }
    const handleModalPrimary = () => {
        setActiveModalPrimary(!activeModalPrimary)
        ResetTokens()
    }
    const handleModalSecondary = () => {
        setActiveModalSecondary(!activeModalSecondary)
        ResetTokens()
    }
    async function updateSwapDetail(tokenA, tokenB, value) {
        const {
            tokensToTransfer,
            priceImpact,
            exchangeRateA,
            exchangeRateB
        } = await getSwapDetail(firstTokenSelected, secondTokenSelected, value, slippSwapToken, feeToPay)
        console.log(tokensToTransfer)
        tokensToTransferSetter(tokensToTransfer)
        priceImpactSetter(priceImpact)
        exchangeRateASetter(exchangeRateA)
        exchangeRateBSetter(exchangeRateB)

        defaultPriceImpactLabelSetter(priceImpact > 1 ? 'Price Impact Warning' : 'Low Price Impact')
        switchMovementSetter(value > 0)
        return tokensToTransfer
    }
    async function changeTokenA(value) {
        amountSwapTokenASetter(value)

        const minTokenToReceive = await updateSwapDetail(firstTokenSelected, secondTokenSelected, value)
        amountSwapTokenBSetter(minTokenToReceive)
    }

    async function changeTokenB(value) {
        amountSwapTokenBSetter(value)

        const minTokenToReceive = await updateSwapDetail(secondTokenSelected, firstTokenSelected, value)
        amountSwapTokenASetter(minTokenToReceive)
    }

    return (
        <Container>
            <ContainerSwapActions>
                <NewSwapContainer>
                    <div>
                        <div>from</div>
                        <div>balance</div>
                    </div>
                    <SwapTokenSelect onClickHandler={handleModalPrimary} token={firstTokenSelected} isWalletConnected={isConnected} />
                    <SwapTokenBalance token={firstTokenSelected} amountSwapTokenSetter={changeTokenA} amountSwapToken={amountSwapTokenA} />
                </NewSwapContainer>
                {
                    activeModalPrimary &&
                    <SwapModal >
                        <SwapContainerAtom >
                            <SwapHeaderAtom>
                                <HeaderModalAtom>Select Token</HeaderModalAtom>
                                <CloseButtonAtom onClick={handleModalPrimary}>
                                    <AiOutlineClose />
                                </CloseButtonAtom>
                            </SwapHeaderAtom>
                            <SearchSectionAtom>
                                <SearchInputAtom
                                    placeholder="Search name"
                                />
                            </SearchSectionAtom>
                            <SwapTokens>
                                {
                                    Object.keys(tokens)
                                        .map((key) => {
                                            const handleToken = () => { onListenerFirstInput(tokens[key]), handleModalPrimary() }

                                            function uuidv4(): React.Key {
                                                throw new Error('Function not implemented.')
                                            }

                                            return <SwapToken key={uuidv4()} token={tokens[key]} handleToken={handleToken} />
                                        })
                                }
                            </SwapTokens>

                        </SwapContainerAtom>
                    </SwapModal>
                }
                <div>Swap Icon</div>
                <div>Swap Token B</div>
                <ButtonConnection isConnected={isConnected} onConnect={onConnect} onDisconnect={onDisconnect} Account={walletAddress} />

            </ContainerSwapActions>
            <ContainerSwapStatics>
                <div>statistics</div>
                <div>statistics</div>
            </ContainerSwapStatics>
        </Container>
    )
}

const NewSwapContainer = styled.section`
    box-sizing: border-box; 
    width: 100%;
    padding: 1rem;
    border:1px solid black;
    border-radius: 10px;
    display: grid;
`

const Container = styled.main`
    box-sizing: border-box;
    height:100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap:10px;
    padding:10px;
    color:black;
`
const ContainerSwapActions = styled.section`
    justify-self: end;
    padding:10px;
    border:1px solid black;
    border-radius: 10px;
    display:grid;
    grid-template-rows: repeat(4,auto);
`
const ContainerSwapStatics = styled.section`
    width: 30%;
    justify-self: start;
    padding:10px;
    border:1px solid black;
    border-radius: 10px;
`
export default SwapNewModule