import React, { useContext, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import styled from 'styled-components'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import { ButtonConnection, CloseButtonAtom, ConfirmSwapButton, HeaderModalAtom, NewSwapButton, SearchInputAtom, SearchSectionAtom, SwapButton, SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect } from '../../atoms'
import FlechaIcon from '../../atoms/FlechaIcon/indext'
import Graphics from '../../atoms/Graphics'
import LoadersSwap from '../../atoms/LoadersSwap'
import { SwapContainerStyled } from '../../atoms/SwapContainerAtom'
import SwitchSwap from '../../atoms/SwitchSwap'
import { SwapConfirmAtom, SwapDetail, SwapModal, SwapToken, SwapTokens } from '../../molecules'
import FloatMenu from '../FloatMenu'

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
    const [allowanceA, setAllowanceA] = useState(0)
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
        getAllowanceAgainstOwnerAndSpender,
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
    function onSwitchTokensHandlers() {
        ResetAll()
        onSwitchTokens()
    }

    async function onDisconnect() {
        onDisconnectWallet()
    }
    const handleModalPrimary = () => {
        setActiveModalPrimary(!activeModalPrimary)
        ResetAll()
    }
    const handleModalSecondary = () => {
        setActiveModalSecondary(!activeModalSecondary)
        ResetAll()
    }
    function ResetAll() {
        amountSwapTokenASetter(0)
        amountSwapTokenBSetter(0)
        ResetTokens()
    }

    async function onConfirmSwap() {
        setActiveModalSwap(false);
        const waiting = await onConfirmSwapConfig(amountSwapTokenA, amountSwapTokenB, slippSwapToken)
        amountSwapTokenASetter(0)
        onConnectConfig()
    }

    async function updateSwapDetail(value = amountSwapTokenA, token = firstTokenSelected) {
        const getSwapDetailP = getSwapDetail(firstTokenSelected, secondTokenSelected, value, slippSwapToken, feeToPay)
        const ps = [getSwapDetailP]

        if (token.contractHash) {
            ps.push(getAllowanceAgainstOwnerAndSpender(token.contractHash, walletAddress))
        }

        const [getSwapDetailResponse, getAllowanceAgainstOwnerAndSpenderResponse] = await Promise.all(ps)

        if (getAllowanceAgainstOwnerAndSpenderResponse != null) {
            setAllowanceA(getAllowanceAgainstOwnerAndSpenderResponse)
        }

        const {
            tokensToTransfer,
            priceImpact,
            exchangeRateA,
            exchangeRateB
        } = getSwapDetailResponse

        tokensToTransferSetter(tokensToTransfer)
        priceImpactSetter(priceImpact)
        exchangeRateASetter(exchangeRateA)
        exchangeRateBSetter(exchangeRateB)

        defaultPriceImpactLabelSetter(priceImpact > 1 ? 'Price Impact Warning' : 'Low Price Impact')
        switchMovementSetter(value > 0)
        return tokensToTransfer
    }

    async function requestIncreaseAllowance(amount, contractHash) {
        console.log("requestIncreaseAllowance")
        await onIncreaseAllow(amount, contractHash, amountSwapTokenA, firstTokenSelected.amount)
        await updateSwapDetail(amountSwapTokenA)
    }

    async function changeTokenA(value) {
        amountSwapTokenASetter(value)

        const minTokenToReceive = await updateSwapDetail(value)
        amountSwapTokenBSetter(minTokenToReceive)
    }

    async function changeTokenB(value) {
        amountSwapTokenBSetter(value)

        const minTokenToReceive = await updateSwapDetail(amountSwapTokenA)
        amountSwapTokenASetter(minTokenToReceive)
    }

    const [searchModalA, searchModalASetter] = useState(false)
    function SelectAndCloseTokenA(token) {
        onSelectFirstToken(token)
        searchModalASetter(false)
        updateSwapDetail(amountSwapTokenA, token)
    }
    const [searchModalB, searchModalBSetter] = useState(false)
    function SelectAndCloseTokenB(token) {
        onSelectSecondToken(token)
        searchModalBSetter(false)
        updateSwapDetail(amountSwapTokenB)
    }

    function makeHalf(amount, Setter) {
        Setter(amount / 2)
    }
    function makeMax(amount, Setter) {
        Setter(amount)
    }

    function returnFilter(tokens, firstTokenSelected) {
        const tokenHead = Object.keys(tokens)
        let tokenFiltered = {}
        const filtered = tokenHead.reduce((acc, keya) => {
            const filter = new RegExp(firstTokenSelected.symbol)
            if (filter.test(keya)) { return }
            tokenFiltered = {
                ...acc,
                [keya]: tokens[keya]
            }
            return tokenFiltered
        }, {})
        return tokenFiltered
    }

    const isApproved = firstTokenSelected.symbol == 'CSPR' || (
        firstTokenSelected.symbol != 'CSPR' &&
        amountSwapTokenA > 0 &&
        allowanceA - amountSwapTokenA >= 0
    )

    return (
        <Container>
            <ContainerSwapActions>
                <NewSwapContainer>
                    <TokenSelectStyled>
                        <NewTokenDetailSelectStyled>
                            <NewTokenDetailItems1Styled>From</NewTokenDetailItems1Styled>
                            <NewTokenDetailItems2Styled src={firstTokenSelected.logoURI} width="50" height="50" />
                            <NewTokenDetailItems3Styled>{firstTokenSelected.symbol}</NewTokenDetailItems3Styled>
                            <NewTokenDetailItems4Styled>
                                <ArrowContainerStyle>
                                    <FlechaIcon onClick={() => { searchModalASetter(true) }} />
                                    {searchModalA && <FloatMenu
                                        tokens={tokens}
                                        selectToken={SelectAndCloseTokenA}
                                        onClick={() => { searchModalASetter(false) }}
                                    />}
                                </ArrowContainerStyle>
                            </NewTokenDetailItems4Styled>
                        </NewTokenDetailSelectStyled>
                    </TokenSelectStyled>
                    <TokenSelectionStyled>
                        <NewTokenDetailActionsStyled>
                            <NewBalanceSpace>Balance: {firstTokenSelected.amount || "--"}</NewBalanceSpace>
                            <ActionContainerStyled>
                                <ButtonHalfMaxContainer>
                                    <ButtonHalfMax onClick={() => { makeHalf(firstTokenSelected.amount, amountSwapTokenASetter) }}>Half</ButtonHalfMax>
                                    <ButtonHalfMax onClick={() => { makeMax(firstTokenSelected.amount, amountSwapTokenASetter) }}>Max</ButtonHalfMax>
                                </ButtonHalfMaxContainer>
                                <BalanceInputContainerStyled>
                                    <BalanceInputItem1Styled>
                                        <BalanceInput
                                            onChange={(e) => { changeTokenA(e.target.value) }}
                                            type="number" name="" id="" value={amountSwapTokenA} />
                                    </BalanceInputItem1Styled>
                                    <BalanceInputItem2Styled>
                                        <p>$34.75</p>
                                    </BalanceInputItem2Styled>
                                </BalanceInputContainerStyled>
                            </ActionContainerStyled>
                        </NewTokenDetailActionsStyled>
                    </TokenSelectionStyled>
                </NewSwapContainer>
                <IconPlaceStyle>
                    <SwitchSwap onClick={() => { onSwitchTokens(); ResetAll() }} />
                    <SwapDetailsStyled>
                        <p>
                        {amountSwapTokenB}{" " + secondTokenSelected.symbol + " "}={" " + amountSwapTokenA + " "}{firstTokenSelected.symbol}
                        </p>
                    </SwapDetailsStyled>
                    <LoadersSwap />
                </IconPlaceStyle>
                <NewSwapContainer>
                    <TokenSelectStyled>
                        <NewTokenDetailSelectStyled>
                            <NewTokenDetailItems1Styled>To</NewTokenDetailItems1Styled>
                            <NewTokenDetailItems2Styled src={secondTokenSelected.logoURI} width="50" height="50" />
                            <NewTokenDetailItems3Styled>{secondTokenSelected.symbol}</NewTokenDetailItems3Styled>
                            <NewTokenDetailItems4Styled>
                                <ArrowContainerStyle>
                                    <FlechaIcon onClick={() => { searchModalBSetter(true) }} />
                                    {searchModalB && <FloatMenu
                                        tokens={returnFilter(tokens, firstTokenSelected)}
                                        selectToken={SelectAndCloseTokenB}
                                        onClick={() => { searchModalBSetter(false) }}
                                    />}
                                </ArrowContainerStyle>
                            </NewTokenDetailItems4Styled>
                        </NewTokenDetailSelectStyled>
                    </TokenSelectStyled>
                    <TokenSelectionStyled>
                        <NewTokenDetailActionsStyled>
                            <NewBalanceSpace>Balance: {secondTokenSelected.amount || "--"}</NewBalanceSpace>
                            <ActionContainerStyled>
                                <ButtonHalfMaxContainer>
                                    <ButtonHalfMax onClick={() => { makeHalf(secondTokenSelected.amount, amountSwapTokenASetter) }}>Half</ButtonHalfMax>
                                    <ButtonHalfMax onClick={() => { makeMax(secondTokenSelected.amount, amountSwapTokenASetter) }}>Max</ButtonHalfMax>
                                </ButtonHalfMaxContainer>
                                <BalanceInputContainerStyled>
                                    <BalanceInputItem1Styled>
                                        <BalanceInput
                                            onChange={(e) => { changeTokenA(e.target.value) }}
                                            type="number" name="" id="" value={amountSwapTokenB} />
                                    </BalanceInputItem1Styled>
                                    <BalanceInputItem2Styled>
                                        <p>$34.75</p>
                                    </BalanceInputItem2Styled>
                                </BalanceInputContainerStyled>
                            </ActionContainerStyled>
                        </NewTokenDetailActionsStyled>
                    </TokenSelectionStyled>
                </NewSwapContainer>
                <SwapDetail
                    firstSymbolToken={firstTokenSelected.symbol}
                    firstTokenAmount={amountSwapTokenA}
                    secondSymbolToken={secondTokenSelected.symbol}
                    secondTokenAmount={amountSwapTokenB}
                    priceImpact={1.5}
                    fullExpanded={false}
                />
                <ButtonSpaceStyled>
                    {
                        !isConnected && <NewSwapButton content="Connect to Wallet" handler={async () => { onConnect() }} />
                    }
                    {
                        !isApproved && isConnected && <NewSwapButton content={`Approve ${amountSwapTokenA} ${firstTokenSelected.symbol}`} handler={async () => { await requestIncreaseAllowance(amountSwapTokenA, firstTokenSelected.contractHash) }} />
                    }
                    {
                        isApproved && isConnected && <NewSwapButton content="Swap" disabled={amountSwapTokenB <= 0} handler={async () => { await onConfirmSwap() }} />
                    }
                </ButtonSpaceStyled>
                {
                    activeModalSwap &&
                    <SwapModal >
                        <SwapContainerAtom >
                            <SwapHeaderAtom>
                                <HeaderModalAtom>Confirm Swap</HeaderModalAtom>
                                <CloseButtonAtom onClick={() => { setActiveModalSwap(false) }}>
                                    <AiOutlineClose />
                                </CloseButtonAtom>
                            </SwapHeaderAtom>
                            <SwapConfirmAtom
                                firstToken={amountSwapTokenA}
                                firstTokenSelected={firstTokenSelected}
                                secondTokenSelected={secondTokenSelected}
                                amountSwapTokenA={amountSwapTokenA}
                                amountSwapTokenB={amountSwapTokenB}
                                slippSwapToken={slippSwapToken}
                                tokensToTransfer={tokensToTransfer}
                                priceImpact={priceImpact}
                                defaultPriceImpactLabel={defaultPriceImpactLabel}
                                slippSwapTokenSetter={slippSwapTokenSetter}
                            >
                                <NewSwapButton content="Confirm Swap" handler={async () => { await onConfirmSwap() }} />
                            </SwapConfirmAtom>

                        </SwapContainerAtom>
                    </SwapModal>
                }

            </ContainerSwapActions>
            <ContainerSwapStatics>
                <CoinContainerStyled>
                    <img src={firstTokenSelected.logoURI} width="50" height="50" />
                    <div>{firstTokenSelected.symbol}</div>
                    <div>|</div>
                    <div>
                        <div>price</div>
                        <div>$1.456</div>
                    </div>
                    <div>
                        <div>24H%</div>
                        <div>12.05</div>
                    </div>
                    <div>
                        <Graphics />
                    </div>
                </CoinContainerStyled>
                <CoinContainerStyled>
                    <img src={secondTokenSelected.logoURI} width="50" height="50" />
                    <div>{secondTokenSelected.symbol}</div>
                    <div>|</div>
                    <div>
                        <div>price</div>
                        <div>$1.456</div>
                    </div>
                    <div>
                        <div>24H%</div>
                        <div>12.05</div>
                    </div>
                    <div>
                        <Graphics />
                    </div>
                </CoinContainerStyled>
            </ContainerSwapStatics>
        </Container>
    )
}
const SwapDetailsStyled = styled.div`
    font-size:1.5rem;
    color: ${props => props.theme.NewPurpleColor}
`

const BalanceInput = styled.input`
    all: unset;
    width: 100%;
    height: 100%;
    text-align: right;
    &:active{
        border: none;
    }
`

const BalanceInputContainerStyled = styled.div`
    width: 100%;
    display: grid;
    grid-template-rows: auto auto;
    justify-items: end;
    gap:10px;
`
const BalanceInputItem1Styled = styled.div`
    align-self: center;
    color:${props => props.theme.NewPurpleColor};
    font-size: 3em;
`
const BalanceInputItem2Styled = styled.div`
align-self: center;
`

const ArrowContainerStyle = styled.div`
    padding-top:10px;
    align-self: start;
`
const ActionContainerStyled = styled.div`
    display: flex;
`

const ButtonHalfMaxContainer = styled.div`
    border-left: 3px solid ${props => props.theme.NewPurpleColor};
    padding-left:10px;
    display: grid;
    gap:10px;
`

const ButtonHalfMax = styled.div<any>`
    background-color: ${props => props.theme.NewAquamarineColor};
    color: ${props => props.theme.NewPurpleColor};
    padding:10px;
    border-radius: 12px;
    cursor: pointer;
`

const IconPlaceStyle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const ButtonSpaceStyled = styled.div`
    justify-self: center;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
`
const TokenSelectStyled = styled.div`
    display: flex;
    justify-content: space-between;
`
const TokenSelectionStyled = styled.div`
    display: flex;
    align-items: center;
    gap:10px;
`

const CoinContainerStyled = styled.div`
    width: 27rem;
    height: 3.5rem;
    box-sizing: border-box;
    border:1px solid black;
    border-radius: 20px;
    padding:10px;
    display: flex;
    gap:10px;
    align-items: center;
`
const ContainerSwapStatics = styled.section`
    justify-self: start;
    box-sizing: border-box;
    width: 29rem;
    height: 10rem;
    padding:2rem;
    border:1px solid black;
    border-radius: 20px;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap:10px;
`
const NewTokenDetailSelectStyled = styled.section`
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto auto;
`
const NewTokenDetailItems1Styled = styled.section`
    grid-column: 1/2;
    grid-row: 1/2;
    justify-self: center;
`
const NewTokenDetailItems2Styled = styled.img`
    grid-column: 1/2;
    grid-row: 2/3;
    align-self: center;
`
const NewTokenDetailItems3Styled = styled.section`
    grid-column: 1/2;
    grid-row: 3/4;
    justify-self: center;
`
const NewTokenDetailItems4Styled = styled.section`
    grid-column: 2/3;
    grid-row: 2/3;
    justify-self: center;
`

const NewTokenDetailActionsStyled = styled.section`
    width: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
`
const NewBalanceSpace = styled.section`
    justify-self:end;
`

const NewSwapContainer = styled.section`
    background-color:white;
    box-sizing: border-box; 
    justify-self: center;
    width: 24rem;
    height: 8rem;
    padding: 1rem;
    border:1px solid black;
    border-radius: 20px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
`

const Container = styled.main`
    box-sizing: border-box;
    justify-self:center;
    box-sizing: border-box;
    height:100%;
    width: 100%;
    gap:10px;
    color:black;
    display: grid;
    grid-template-columns: auto auto;
`
const ContainerSwapActions = styled.section`
    justify-self: end;
    box-sizing: border-box;
    width: 29rem;
    height: 42rem;
    border:1px solid black;
    border-radius: 20px;
    display:grid;
    flex-direction: column;
    justify-content:center;
    align-items: center;
    gap:10px;
    padding:2rem;
`

export default SwapNewModule