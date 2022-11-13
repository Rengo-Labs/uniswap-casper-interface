import NewLayout from '../../../layout/NewLayout'
import SwapNewModule from '../../organisms/SwapNewModule'
import { ContainerSwapModule } from '../../atoms/ContainerSwapModule'
import { useState,useContext } from 'react'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'

export const Swap = () => {
  //const query = useQuery()
  //const tokenOne = query.get("tokenOne")
  const [activeModalPrimary, setActiveModalPrimary] = useState(false)
  const [activeModalSecondary, setActiveModalSecondary] = useState(false)
  const [activeModalSwap, setActiveModalSwap] = useState(false)
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
      <ContainerSwapModule>
        <div>
          <SwapNewModule />
        </div>
      </ContainerSwapModule>
    </NewLayout>
  )
}
