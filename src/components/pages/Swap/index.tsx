import React, { useContext, useState } from 'react'

import { useLocation } from 'react-router-dom'
import {
  CardContainer, CloseButtonAtom, ConfirmSwapButton, HeaderModalAtom, SearchSectionAtom, SwapButton,
  SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect,
  SearchInputAtom,
  CustomToggle
} from '../../atoms'
import { SwapModule } from '../../organisms'
import styled from 'styled-components'
import { BasicLayout } from '../../../layout/Basic'
import { SwapConfirmAtom, SwapModal, SwapTokens, SwapToken, CollapsingBox, SwitchBox, ApprovalButton, ToggleBox } from '../../molecules'
import { AiOutlineClose } from 'react-icons/ai'
import { v4 as uuidv4 } from 'uuid';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import { WrappedApprovalButton } from "./styles";
import NewLayout from '../../../layout/NewLayout'
import SwapNewModule from '../../organisms/SwapNewModule'

export const Swap = () => {
  //const query = useQuery()
  //const tokenOne = query.get("tokenOne")
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

  const handleModalPrimary = () => {
    setActiveModalPrimary(!activeModalPrimary)
    ResetTokens()
  }
  const handleModalSecondary = () => {
    setActiveModalSecondary(!activeModalSecondary)
    ResetTokens()
  }

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
    getSwapDetails,
    onIncreaseAllow
  } = useContext(ConfigProviderContext)

  function onConnect() {
    onConnectConfig()
  }

  async function onConfirmSwap() {
    setActiveModalSwap(false);
    const waiting = await onConfirmSwapConfig(amountSwapTokenA, amountSwapTokenB, slippSwapToken)
    console.log("Paso anti end")
    amountSwapTokenASetter(0)
    console.log("Paso end")
    onConnectConfig()
  }

  function onSwitch(amountA, amountB, rateA, rateB) {
    onSwitchTokens()
    amountSwapTokenASetter(amountB)
    amountSwapTokenBSetter(amountA)
    exchangeRateASetter(rateB)
    exchangeRateBSetter(rateA)
  }

  function ResetTokens() {
    amountSwapTokenASetter(0)
    amountSwapTokenBSetter(0)
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

  async function updateSwapDetail(tokenA, tokenB, value) {
    const {
      tokensToTransfer,
      priceImpact,
      exchangeRateA,
      exchangeRateB
    } = await getSwapDetails(firstTokenSelected, secondTokenSelected, value, slippSwapToken, feeToPay)
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
    const isApproved = await onIncreaseAllow(amount, contractHash, amountSwapTokenA, firstTokenSelected.amount)
    isApprovedTokenSetter(isApproved)
  }

  function onListenerFirstInput(token) {
    if (token.symbol !== secondTokenSelected.symbol)
      onSelectFirstToken(token)

  }

  function onListenerSecondInput(token) {
    if (token.symbol !== secondTokenSelected.symbol)
      onSelectSecondToken(token)

  }
  const [toggleState, toggleStateSetter] = useState(false)
  return (
    <NewLayout>
      <Container>
        <ModuleSwapStyled>
          <SwapNewModule />
        </ModuleSwapStyled>
      </Container>
    </NewLayout>
  )
}
const ModuleSwapStyled = styled.div`
`
const ExtendedCustomToggle = styled(CustomToggle)`
  min-width: 1000px;
  width: 1000px;
  input{
    min-width: 1000px;
    width: 1000px;
    background-color:red ;
  }
`

const SwapLiquidityButtonStyled = styled.button`
  border-radius:10px;
  
`
function SwapLiquidityButton({ children }) {
  return (<SwapLiquidityButtonStyled>{children}</SwapLiquidityButtonStyled>)
}

const SwapLiquidityContainerStyled = styled.div`
  border: 1px solid black;
  border-radius:10px;
  display: grid;
  grid-template:auto / repeat(3,1fr);
`
function SwapLiquidityContainer({ children }) {
  return (<SwapLiquidityContainerStyled>{children}</SwapLiquidityContainerStyled>)
}

const SwapLiquidityStyled = styled.div`
  justify-self: center;
  width: 12%;
`
function SwapLiquidity({ children }) {
  return (<SwapLiquidityStyled>{children}</SwapLiquidityStyled>)
}
const ContainerStyled = styled.div`
  width: 100%;
  display:grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  background-color: #F7FCFE;
`
function Container({ children }) {
  return (<ContainerStyled>{children}</ContainerStyled>)
}