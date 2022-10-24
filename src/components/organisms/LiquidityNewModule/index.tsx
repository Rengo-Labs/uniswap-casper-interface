import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineClose, AiFillPlusCircle } from 'react-icons/ai'
import styled from 'styled-components'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import { CloseButtonAtom, HeaderModalAtom, NewSwapButton, SwapContainerAtom, SwapHeaderAtom } from '../../atoms'
import FlechaIcon from '../../atoms/FlechaIcon/indext'
import {LPDetail, SwapConfirmAtom, SwapModal} from '../../molecules'
import FloatMenu from '../FloatMenu'
import {useSearchParams} from "react-router-dom";
import {LiquidityRemovingModule} from "../LiquidityRemovingModule";
import {LiquidityItem} from "../../molecules/LiquidityItem";
import wethIcon from "../../../assets/swapIcons/wethIcon.svg";
import casprIcon from "../../../assets/swapIcons/casprIcon.png";
import {TbTrash} from "react-icons/tb";
import {lightTheme} from "../../../contexts/ThemeContext/themes";
import {CircleButton} from "../../molecules/POCTBody/styles";

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
    const [isApprovedToken, isApprovedTokenSetter] = useState(false)
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
        onIncreaseAllow,
        onDisconnectWallet,
        ResetTokens,
        onListenerFirstInput,
        getAccountHash,
        getPoolDetailByUser,
        getPoolList
    } = useContext(ConfigProviderContext)
    const {
        walletAddress
    } = configState

    const [usersLP, setUsersLP] = useState([])
    const [pools, setPools] = useState([])
    const [userLiquidity, setUserLiquidity] = useState(0)
    const [isOpenedRemoving, setOpenedRemoving] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect( () => {
        const t0 = searchParams.get("token0")
        const t1 = searchParams.get("token1")
        if (t0) {
            onSelectFirstToken(tokens[t0])
            onSelectSecondToken(tokens[t1])
        }
        const isOpened = searchParams.get("remove")
        if (isOpened) {
            setOpenedRemoving(true)
        }

        const result = async () => {
            const list = await getPoolList()
            setPools(list)
            if (isConnected) {
                const newList = await getPoolDetailByUser(getAccountHash())
                setUsersLP(newList)
            }
        }
        result().catch(() => console.log("Error"))

    }, [isConnected])

    const calculateUserLP = (token0, token1, amount0, amount1) => {
        const filter = pools.filter(r => r.pair.token0 === token0 && r.pair.token1 === token1)
        if (filter.length > 0) {
            const userLP = Math.max(amount0*filter[0].totalSupply/filter[0].reserve0, amount1*filter[0].totalSupply/filter[0].reserve1)
            return userLP
        }

        const filter2 = pools.filter(r => r.pair.token1 === token0 && r.pair.token0 === token1)
        if (filter2.length > 0) {
            const userLP = Math.max(amount1*filter2[0].totalSupply/filter2[0].reserve1, amount0*filter2[0].totalSupply/filter2[0].reserve0)
            return userLP
        }
    }
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
        setActiveModalSwap(false);
        const waiting = await onConfirmSwapConfig(amountSwapTokenA, amountSwapTokenB, slippSwapToken)
        amountSwapTokenASetter(0)
        onConnectConfig()
    }
    async function updateSwapDetail(tokenA, tokenB, value) {
        const {
            tokensToTransfer,
            priceImpact,
            exchangeRateA,
            exchangeRateB
        } = await getSwapDetail(firstTokenSelected, secondTokenSelected, value, slippSwapToken, feeToPay)

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
        const userLP = calculateUserLP(firstTokenSelected.symbolPair, secondTokenSelected.symbolPair, parseFloat(value), parseFloat(minTokenToReceive))

        setUserLiquidity(userLP)
        amountSwapTokenBSetter(minTokenToReceive)
    }

    async function changeTokenB(value) {
        amountSwapTokenBSetter(value)
        const minTokenToReceive = await updateSwapDetail(secondTokenSelected, firstTokenSelected, value)
        const userLP = calculateUserLP(firstTokenSelected.symbolPair, secondTokenSelected.symbolPair, parseFloat(value), parseFloat(minTokenToReceive))

        setUserLiquidity(userLP)
        amountSwapTokenASetter(minTokenToReceive)
    }

    const [searchModalA, searchModalASetter] = useState(false)
    function SelectAndCloseTokenA(token) {
        onSelectFirstToken(token)
        searchModalASetter(false)
    }
    const [searchModalB, searchModalBSetter] = useState(false)
    function SelectAndCloseTokenB(token) {
        onSelectSecondToken(token)
        searchModalBSetter(false)
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

    async function onEnable() {
        await onIncreaseAllow(amountSwapTokenB, secondTokenSelected.contractHash)
        onConnectConfig()
    }

    async function onLiquidiy() {

        await onAddLiquidity(amountSwapTokenA, amountSwapTokenB)
        onConnectConfig()
    }

    async function onChangeValueToken(value) {
        amountSwapTokenASetter(value)
        const { secondTokenReturn, minAmountReturn } = await onCalculateReserves(value)
        amountSwapTokenBSetter(secondTokenReturn)
        slippSwapTokenSetter(minAmountReturn)
    }

    const enableButton = (amount0, amount1) => {
        if (!isConnected) {
            return true
        }
        if (amount0 <= 0 || amount0 > firstTokenSelected.amount) {
            return true
        }
        if (amount1 <= 0 || amount1 > secondTokenSelected.amount) {
            return true
        }
    }

    return (
        <Container>
            <ContainerSwapActions>
                <NewSwapContainer style={{backgroundColor: "white"}}>
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
                <NewSwapContainer style={{backgroundColor: "white"}}>
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
                {
                    amountSwapTokenA > 0 &&
                    <LPDetail
                        firstSymbolToken={firstTokenSelected.symbolPair}
                        firstTokenAmount={amountSwapTokenA}
                        secondSymbolToken={secondTokenSelected.symbolPair}
                        secondTokenAmount={amountSwapTokenB}
                        liquidity={userLiquidity.toFixed(8)}
                        slippage={slippageToleranceSelected}
                        slippageSetter={slippSwapTokenSetter} />
                }
                <ButtonSpaceStyled>
                    <NewSwapButton style={{height: "8.7vh", width: "20.4vw"}} disabled={enableButton(amountSwapTokenA, amountSwapTokenB)} content="Enable" handler={async () => { await onEnable() }} />
                    <NewSwapButton style={{height: "8.7vh", width: "20.4vw"}} disabled={enableButton(amountSwapTokenA, amountSwapTokenB)} content="Add Liquidity" handler={async () => { await onLiquidiy() }} />
                </ButtonSpaceStyled>
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
                                <NewSwapButton disabled={true} content="Confirm Add Liquidity" handler={async () => { await onLiquidiy(); setActiveModalSwap(false) }} />
                            </ButtonSpaceModalStyled>
                        </SwapContainerAtom>
                    </SwapModal>
                }
            </ContainerSwapActions>
            {
                usersLP.length > 0 &&
                <ContainerSwapStatics>
                    {// Loop over the table rows
                        usersLP.map(row => {
                            return (
                                // Apply the row props
                                <LiquidityItem
                                    fullExpanded={isOpenedRemoving}
                                    firstIcon={casprIcon}
                                    firstSymbol={row.token0}
                                    firstLiquidity={row.token0Liquidity}
                                    secondIcon={wethIcon}
                                    secondSymbol={row.token1}
                                    secondLiquidity={row.token1Liquidity}
                                    liquidity={row.totalLiquidityPool}
                                    perLiquidity={((row.totalPool / row.totalSupply)*100).toFixed(2)} >

                                    <LiquidityRemovingModule isConnected={true}
                                                             openedPopup={isOpenedRemoving}
                                                             onClose={() => {console.log("Cerrar")}}
                                                             onRemove={() => {onConnectConfig(); console.log("Remove liquidity")}}
                                                             firstHash={row.contract0}
                                                             firstSymbol={row.token0}
                                                             firstLiquidity={row.token0Liquidity}
                                                             secondHash={row.contract1}
                                                             secondSymbol={row.token1}
                                                             secondLiquidity={row.token1Liquidity}
                                                             liquidityId={row.totalPoolId}
                                                             liquidity={row.totalPool}
                                                             liquidityUSD={row.totalPoolUSD}
                                                             setAmount={(value) => {console.log("Setear valor ", value)}}
                                    >
                                        <CircleButton>
                                            <TbTrash style={{alignSelf: "center", color: lightTheme.thirdBackgroundColor}} size="1.3rem"/>
                                        </CircleButton>
                                    </LiquidityRemovingModule>
                                </LiquidityItem>
                            )
                        })
                    }
                </ContainerSwapStatics>
            }
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
    border-radius: 20px;
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