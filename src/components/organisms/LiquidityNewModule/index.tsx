import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineClose, AiFillPlusCircle } from 'react-icons/ai'
import styled from 'styled-components'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import { ButtonConnection, CloseButtonAtom, ConfirmSwapButton, HeaderModalAtom, NewSwapButton, SearchInputAtom, SearchSectionAtom, SwapButton, SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect } from '../../atoms'
import FlechaIcon from '../../atoms/FlechaIcon/indext'
import Graphics from '../../atoms/Graphics'
import {LPDetail, SwapConfirmAtom, SwapModal, SwapToken, SwapTokens} from '../../molecules'
import FloatMenu from '../FloatMenu'

const LiquidityNewModule = () => {
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
    const [allowanceB, setAllowanceB] = useState(0)
    const {
        onConnectConfig,
        onAddLiquidity,
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
        setActiveModalSwap(false)
        const waiting = await onConfirmSwapConfig(amountSwapTokenA, amountSwapTokenB, slippSwapToken)
        amountSwapTokenASetter(0)
        onConnectConfig()
    }
    async function updateSwapDetail(tokenA, tokenB, value = amountSwapTokenA) {
        const getSwapDetailP = getSwapDetail(firstTokenSelected, secondTokenSelected, value, slippSwapToken, feeToPay)
        const ps = [getSwapDetailP]

        if (tokenA.contractHash) {
            ps.push(getAllowanceAgainstOwnerAndSpender(tokenA.contractHash, walletAddress))
        } else {
            ps.push(Promise.resolve(0))
        }

        if (tokenB.contractHash) {
            ps.push(getAllowanceAgainstOwnerAndSpender(tokenB.contractHash, walletAddress))
        } else {
            ps.push(Promise.resolve(0))
        }

        const [getSwapDetailResponse, getTokenAAllowanceResponse, getTokenBAllowanceResponse] = await Promise.all(ps)

        setAllowanceA(getTokenAAllowanceResponse)
        setAllowanceB(getTokenBAllowanceResponse)

        console.log('zzz', getTokenAAllowanceResponse, getTokenBAllowanceResponse)

        const {
            tokensToTransfer,
            priceImpact,
            exchangeRateA,
            exchangeRateB
        } = getSwapDetailResponse
        console.log(tokensToTransfer)
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
        await updateSwapDetail(firstTokenSelected, secondTokenSelected)
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

    const [searchModalA, searchModalASetter] = useState(false)
    function SelectAndCloseTokenA(token) {
        onSelectFirstToken(token)
        searchModalASetter(false)
        updateSwapDetail(token, secondTokenSelected)
    }
    const [searchModalB, searchModalBSetter] = useState(false)
    function SelectAndCloseTokenB(token) {
        onSelectSecondToken(token)
        searchModalBSetter(false)
        updateSwapDetail(firstTokenSelected, token)
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
    async function onLiquidity() {
        await onAddLiquidity(amountSwapTokenA, amountSwapTokenB)
        onConnectConfig()
    }

    async function onChangeValueToken(value) {
        amountSwapTokenASetter(value)
        const { secondTokenReturn, minAmountReturn } = await onCalculateReserves(value)
        amountSwapTokenBSetter(secondTokenReturn)
        slippSwapTokenSetter(minAmountReturn)
    }

    const freeAllowanceA = allowanceA / Math.pow(10, 9) - parseFloat(amountSwapTokenA)

    const isApprovedA = firstTokenSelected.symbol == 'CSPR' || (
        firstTokenSelected.symbol != 'CSPR' &&
        freeAllowanceA >= 0
    )

    const freeAllowanceB = allowanceB / Math.pow(10, 9) - parseFloat(amountSwapTokenB)

    const isApprovedB = secondTokenSelected.symbol == 'CSPR' || (
        secondTokenSelected.symbol != 'CSPR' &&
        freeAllowanceB >= 0
    )

    console.log('1', freeAllowanceB, allowanceB)

    return (
        <Container>
            <ContainerSwapActions>
                <NewSwapContainer>
                    <TokenSelectStyled>
                        <div>From</div>
                        <div>Balance: {firstTokenSelected.amount || "--"}</div>
                    </TokenSelectStyled>
                    <TokenSelectionStyled>
                        <div>
                            <img src={firstTokenSelected.logoURI} width="50" height="50" />
                            <div>{firstTokenSelected.symbol}</div>
                        </div>
                        <ArrowContainerStyle>
                            <FlechaIcon onClick={() => { searchModalASetter(true) }} />
                            {searchModalA && <FloatMenu
                                tokens={tokens}
                                selectToken={SelectAndCloseTokenA}
                                onClick={() => { searchModalASetter(false) }}
                            />}
                        </ArrowContainerStyle>
                        <StickStyle />
                        <ButtonHalfMaxContainer>
                            <ButtonHalfMax onClick={() => { makeHalf(firstTokenSelected.amount, amountSwapTokenASetter) }}>Half</ButtonHalfMax>
                            <ButtonHalfMax onClick={() => { makeMax(firstTokenSelected.amount, amountSwapTokenASetter) }}>Max</ButtonHalfMax>
                        </ButtonHalfMaxContainer>
                        <div>
                            <BalanceInput
                                onChange={(e) => { changeTokenA(e.target.value) }}
                                type="number" name="" id="" value={amountSwapTokenA} />
                        </div>
                    </TokenSelectionStyled>
                </NewSwapContainer>
                <IconPlaceStyle>
                    <AiFillPlusCircle />
                </IconPlaceStyle>
                <NewSwapContainer>
                    <TokenSelectStyled>
                        <div>To</div>
                        <div>Balance: {secondTokenSelected.amount || "--"}</div>
                    </TokenSelectStyled>
                    <TokenSelectionStyled>
                        <div>
                            <img src={secondTokenSelected.logoURI} width="50" height="50" />
                            <div>{secondTokenSelected.symbol}</div>
                        </div>
                        <ArrowContainerStyle>
                            <FlechaIcon onClick={() => { searchModalBSetter(true) }} />
                            {searchModalB && <FloatMenu
                                tokens={returnFilter(tokens, firstTokenSelected)}
                                selectToken={SelectAndCloseTokenB}
                                onClick={() => { searchModalBSetter(false) }}
                            />}
                        </ArrowContainerStyle>
                        <StickStyle />
                        <ButtonHalfMaxContainer>
                            <ButtonHalfMax onClick={() => { makeHalf(secondTokenSelected.amount, amountSwapTokenBSetter) }}>Half</ButtonHalfMax>
                            <ButtonHalfMax onClick={() => { makeMax(secondTokenSelected.amount, amountSwapTokenBSetter) }}>Max</ButtonHalfMax>
                        </ButtonHalfMaxContainer>
                        <div>
                            <BalanceInput
                                onChange={(e) => { changeTokenB(e.target.value) }}
                                type="number" name="" id="" value={amountSwapTokenB} />
                        </div>
                    </TokenSelectionStyled>
                </NewSwapContainer>
                <ButtonSpaceStyled>
                    { isConnected && amountSwapTokenA > firstTokenSelected.amount && <p>you don't have enough {firstTokenSelected.symbol} to add</p> }
                    { isConnected && amountSwapTokenB > secondTokenSelected.amount && <p>you don't have enough {secondTokenSelected.symbol} to add</p> }
                    { !isConnected && <NewSwapButton content="Connect to Wallet" handler={() => { onConnect() }} /> }
                    {
                        !isApprovedA && isConnected && amountSwapTokenA <= firstTokenSelected.amount && <NewSwapButton content={`Approve ${-freeAllowanceA} ${firstTokenSelected.symbol}`} handler={async () => { await requestIncreaseAllowance(-freeAllowanceA, firstTokenSelected.contractHash) }} />
                    }
                    {
                        !isApprovedB && isConnected && amountSwapTokenB <= secondTokenSelected.amount && <NewSwapButton content={`Approve ${-freeAllowanceB} ${secondTokenSelected.symbol}`} handler={async () => { await requestIncreaseAllowance(-freeAllowanceB, secondTokenSelected.contractHash) }} />
                    }
                    { isApprovedA && isApprovedB && isConnected && <NewSwapButton content="Add Liquidity" handler={async () => { await onLiquidity() }} /> }
                </ButtonSpaceStyled>
                {
                    amountSwapTokenA > 0 &&
                    <LPDetail
                        firstSymbolToken={firstTokenSelected.symbolPair}
                        firstTokenAmount={amountSwapTokenA}
                        secondSymbolToken={secondTokenSelected.symbolPair}
                        secondTokenAmount={amountSwapTokenB}
                        slippage={slippageToleranceSelected}
                        slippageSetter={slippSwapTokenSetter}
                        fullExpanded = {false}
                        expandedEnabled = {false}
                        slippageEnabled = {false} />
                }
                {
                    activeModalSwap &&
                    <SwapModal >
                        <SwapContainerAtom >
                            <SwapHeaderAtom>
                                <HeaderModalAtom>Confirm Add Liquidity</HeaderModalAtom>
                                <CloseButtonAtom onClick={() => { setActiveModalSwap(false) }}>
                                    <AiOutlineClose />
                                </CloseButtonAtom>
                            </SwapHeaderAtom>
                            <SwapConfirmAtom
                                firstTokenSelected={firstTokenSelected}
                                secondTokenSelected={secondTokenSelected}
                                amountSwapTokenA={amountSwapTokenA}
                                amountSwapTokenB={amountSwapTokenB}
                                slippSwapToken={slippSwapToken}
                                liquidity={true}
                            >

                            </SwapConfirmAtom>
                            <ButtonSpaceModalStyled>
                                <NewSwapButton content={ "Approve " + secondTokenSelected.symbol } handler={ async () => { await onLiquidity(); setActiveModalSwap(false) } } />
                                <NewSwapButton content={ "Approve " + secondTokenSelected.symbol } handler={ async () => { await onLiquidity(); setActiveModalSwap(false) } } />
                                <NewSwapButton disabled content="Confirm Add Liquidity" handler={ async () => { await onLiquidity(); setActiveModalSwap(false) } } />
                            </ButtonSpaceModalStyled>
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
const BalanceInput = styled.input`
    all: unset;
    width: 100%;
    height: 100%;
    text-align: right;
    &:active{
        border: none;
    }
`

const StickStyle = styled.div`
    color:${props => props.theme.NewPurpleColor};
    font-size: 5em;
    border-left:3px solid ${props => props.theme.NewPurpleColor};
    &::before{
        content: ".";
        color:white;
    }
`

const ArrowContainerStyle = styled.div`
    align-self: start;
`
const ButtonHalfMaxContainer = styled.div`
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
    justify-self: center;
    font-size: 3rem;
    color: ${props => props.theme.NewPurpleColor};
`
const ButtonSpaceStyled = styled.div`
    justify-self: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap:10px;
    justify-content: center;
`
const ButtonSpaceModalStyled = styled.div`
    width: 100%;
    display: flex;
    gap:10px;
    justify-content: center;
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
    box-sizing: border-box;
    border:1px solid black;
    border-radius: 10px;
    padding:10px;
    display: flex;
    gap:10px;
    align-items: center;
`
const ContainerSwapStatics = styled.section`
    box-sizing: border-box;
    justify-self: start;
    padding:10px;
    border:1px solid black;
    border-radius: 10px;
    display:flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    gap:10px;
`
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
    gap:10px;
    padding:10px;
    color:black;
    display: grid;
    grid-template-columns: repeat(2,auto);
    align-items: start;
`
const ContainerSwapActions = styled.section`
    justify-self: end;
    padding:10px;
    border:1px solid black;
    border-radius: 10px;
    display:grid;
    gap:10px;
    grid-template-rows: repeat(4,auto);
`

export default LiquidityNewModule