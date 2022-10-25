import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineClose, AiFillPlusCircle } from 'react-icons/ai'
import styled from 'styled-components'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import { CloseButtonAtom, HeaderModalAtom, NewSwapButton, SwapContainerAtom, SwapHeaderAtom } from '../../atoms'
import FlechaIcon from '../../atoms/FlechaIcon/indext'
import Graphics from '../../atoms/Graphics'
import LoadersSwap from '../../atoms/LoadersSwap'
import SwitchSwap from '../../atoms/SwitchSwap'
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

import {
    TokenSelectStyled,
    TokenSelectionStyled,
    NewTokenDetailSelectStyled,
    NewTokenDetailItems1Styled,
    NewTokenDetailItems2Styled,
    NewTokenDetailItems3Styled,
    NewTokenDetailItems4Styled,
    NewSwapContainer,
    NewTokenDetailActionsStyled,
    NewBalanceSpace,
    ArrowContainerStyle,
    ActionContainerStyled,
    BalanceInput,
    BalanceInputContainerStyled,
    BalanceInputItem1Styled,
    BalanceInputItem2Styled,
    SwapDetailsStyled,    
    ButtonHalfMaxContainer,
    ButtonHalfMax,
    IconPlaceStyle,
    ButtonSpaceStyled,
} from '../SwapNewModule'

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
        setActiveModalSwap(false)
        const waiting = await onConfirmSwapConfig(amountSwapTokenA, amountSwapTokenB, slippSwapToken)
        amountSwapTokenASetter(0)
        onConnectConfig()
    }
    async function updateSwapDetail(tokenA, tokenB, value = amountSwapTokenA, token = firstTokenSelected) {
        const getSwapDetailP = getSwapDetail(tokenA, tokenB, value, token, slippSwapToken, feeToPay)
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

    async function changeTokenA(value: string) {
        let filteredValue = parseFloat(value)
        if (isNaN(filteredValue)) {
            filteredValue = 0
        } else if (filteredValue < 0) {
            filteredValue = Math.abs(filteredValue)
        }

        amountSwapTokenASetter(filteredValue)

        const minTokenToReceive = await updateSwapDetail(firstTokenSelected, secondTokenSelected, filteredValue)
        const userLP = calculateUserLP(firstTokenSelected.symbolPair, secondTokenSelected.symbolPair, filteredValue, minTokenToReceive)

        setUserLiquidity(userLP)
        amountSwapTokenBSetter(minTokenToReceive)
    }

    async function changeTokenB(value: string) {let filteredValue = parseFloat(value)
        if (isNaN(filteredValue)) {
            filteredValue = 0
        } else if (filteredValue < 0) {
            filteredValue = Math.abs(filteredValue)
        }

        amountSwapTokenBSetter(filteredValue)

        const minTokenToReceive = await updateSwapDetail(secondTokenSelected, firstTokenSelected, filteredValue, secondTokenSelected)
        const userLP = calculateUserLP(firstTokenSelected.symbolPair, secondTokenSelected.symbolPair, filteredValue, minTokenToReceive)

        setUserLiquidity(userLP)
        amountSwapTokenASetter(minTokenToReceive)
    }

    const [searchModalA, searchModalASetter] = useState(false)
    async function SelectAndCloseTokenA(token) {
        onSelectFirstToken(token)
        searchModalASetter(false)

        const minTokenToReceive = await updateSwapDetail(token, secondTokenSelected, amountSwapTokenA, token)
        amountSwapTokenBSetter(minTokenToReceive)

    }
    const [searchModalB, searchModalBSetter] = useState(false)
    async function SelectAndCloseTokenB(token) {
        onSelectSecondToken(token)
        searchModalBSetter(false)
        const minTokenToReceive = await updateSwapDetail(firstTokenSelected, token, amountSwapTokenB, token)
        amountSwapTokenASetter(minTokenToReceive)
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
                                            min={0}
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
                <NewSwapContainer style={{backgroundColor: "white"}}>
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
                                            min={0}
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
                { 
                    <ButtonSpaceStyled>
                        { 
                            /*
                                <NewSwapButton style={{height: "8.7vh", width: "20.4vw"}} disabled={enableButton(amountSwapTokenA, amountSwapTokenB)} content="Enable" handler={async () => { await onEnable() }} />
                                <NewSwapButton style={{height: "8.7vh", width: "20.4vw"}} disabled={enableButton(amountSwapTokenA, amountSwapTokenB)} content="Add Liquidity" handler={async () => { await onLiquidity() }} />
                            */
                        }
                        { isConnected && amountSwapTokenA > firstTokenSelected.amount && <p>you don't have enough {firstTokenSelected.symbol} to add</p> }
                        { isConnected && amountSwapTokenB > secondTokenSelected.amount && <p>you don't have enough {secondTokenSelected.symbol} to add</p> }
                        { !isConnected && <NewSwapButton content="Connect to Wallet" handler={() => { onConnect() }} /> }
                        {
                            !isApprovedA && isConnected && amountSwapTokenA <= firstTokenSelected.amount && <NewSwapButton content={`Approve ${-freeAllowanceA} ${firstTokenSelected.symbol}`} handler={async () => { await requestIncreaseAllowance(-freeAllowanceA, firstTokenSelected.contractHash) }} />
                        }
                        {
                            !isApprovedB && isConnected && amountSwapTokenB <= secondTokenSelected.amount && <NewSwapButton content={`Approve ${-freeAllowanceB} ${secondTokenSelected.symbol}`} handler={async () => { await requestIncreaseAllowance(-freeAllowanceB, secondTokenSelected.contractHash) }} />
                        }
                        { isApprovedA && isApprovedB && isConnected && <NewSwapButton disabled={ amountSwapTokenA <= 0 || amountSwapTokenB  <= 0}content="Add Liquidity" handler={async () => { await onLiquidity() }} /> }
                    </ButtonSpaceStyled>
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
                                <NewSwapButton disabled={true} content="Confirm Add Liquidity" handler={async () => { await onLiquidity(); setActiveModalSwap(false) }} />
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

const ButtonSpaceModalStyled = styled.div`
    width: 100%;
    display: flex;
    gap:10px;
    justify-content: center;
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