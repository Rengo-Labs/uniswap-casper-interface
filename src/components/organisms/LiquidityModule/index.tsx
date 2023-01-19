import BigNumber from 'bignumber.js'

import React, { useContext, useEffect, useState } from 'react'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import {
  ActionContainerNSM,
  ArrowContainerNSM,
  BalanceInputContainerNSM,
  BalanceInputItem1NSM,
  BalanceInputItem2NSM,
  BalanceInputNSM,
  ButtonHalfMax,
  ButtonHalfMaxContainer,
  ButtonSpaceNSM,
  ContainerSwapActionsNSM,
  ExchangeRateBox,
  IconPlaceNSM,
  NewBalanceSpaceNSM,
  NewSwapButtonWidth100,
  NewSwapContainerNSM,
  NewTokenDetailActionsNSM,
  NewTokenDetailItems1NSM,
  NewTokenDetailItems2NSM,
  NewTokenDetailItems3NSM,
  NewTokenDetailItems4NSM,
  NewTokenDetailSelectNSM,
  SwapDetailsNSM,
  TokenSelectionNSM,
  TokenSelectNSM,
  FlechaIcon,
  TrashIcon
} from '../../atoms'
import SwitchSwap from '../../atoms/SwitchSwap'
import { LPDetail } from '../../molecules'
import FloatMenu from '../FloatMenu'
import { useSearchParams } from "react-router-dom";
import { LiquidityItem } from "../../molecules/LiquidityItem";
import { CircleButton } from "../../molecules/POCTBody/styles";

import {
  convertAllFormatsToUIFixedString,
} from '../../../commons'
import { BalanceInput } from '../../atoms/BalanceInputNSM'
import { ContainerLiquidityNSM } from '../../atoms/ContainerLiquidityNSM'
import { ContainerLiquidityPoolList } from "../../atoms/ContainerLiquidityPoolList";
import {UpdatableCircle} from "../../atoms/UpdatableCircle";
import {ProgressBarProviderContext} from "../../../contexts/ProgressBarContext";
import {LiquidityRemovingWithInputRangeModule} from "../LiquidityRemovingWithInputRangeModule";
import {LiquidityProviderContext} from "../../../contexts/LiquidityContext";
import { globalStore } from '../../../store/store'

const LiquidityNewModule = () => {
  const {
    pairState,
    onConnectWallet,
    onSelectFirstToken,
    onSelectSecondToken,
    onSwitchTokens,
    tokens,
    firstTokenSelected,
    secondTokenSelected,
    isConnected,
    onIncreaseAllow,
    getPoolList,
    gasPriceSelectedForLiquidity,
    refreshAll,
    calculateUSDtokens,
    findReservesBySymbols,
  } = useContext(ConfigProviderContext)

  const {
    isRemovingPopupOpen,
    setRemovingPopup,
    onAddLiquidity,
    getLiquidityDetails,
  } = useContext(LiquidityProviderContext)
  const { progressBar } = useContext(ProgressBarProviderContext)

  const userPairData = Object.entries(pairState).map(([k, v]) => v)

  const [amountSwapTokenA, amountSwapTokenASetter] = useState<any>(0)
  const [amountSwapTokenB, amountSwapTokenBSetter] = useState<any>(0)
  const [feeToPay, feeToPaySetter] = useState<any>(0.03)
  const [exchangeRateA, exchangeRateASetter] = useState<any>(0)
  const [exchangeRateB, exchangeRateBSetter] = useState<any>(0)

  const [totalLiquidity, setTotalLiquidity] = useState("0")
  const [isOpenedRemoving, setOpenedRemoving] = useState(isRemovingPopupOpen)
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentFReserve, setFirstReserve] = useState(0)
  const [currentSReserve, setSecondReserve] = useState(0)

  const [lastChanged, setLastChanged] = useState('')
  const [valueAUSD, setValueAUSD] = useState("0")
  const [valueBUSD, setValueBUSD] = useState("0")

  const [gasFee, gasFeeSetter] = useState(gasPriceSelectedForLiquidity)
  const { slippageTolerance, updateSlippageTolerance } = globalStore()

  useEffect(() => {
    const t0 = searchParams.get("token0")
    const t1 = searchParams.get("token1")
    if (t0) {
      onSelectFirstToken(tokens[t0])
      onSelectSecondToken(tokens[t1])
    }

    if (isRemovingPopupOpen) {
      setOpenedRemoving(true)
      setRemovingPopup(false)
    }

    updateLiquidityDetail(
      firstTokenSelected, 
      secondTokenSelected,
      amountSwapTokenA,
      lastChanged == 'A' ? firstTokenSelected : secondTokenSelected,
    );
  }, [isConnected, pairState]);

  useEffect(() => {
    progressBar(async () => lastChanged == 'A' ? await changeTokenA(amountSwapTokenA) : await changeTokenB(amountSwapTokenB))
  }, [amountSwapTokenA, amountSwapTokenB]);

  const calculateUSDValues = (amountA, amountB) => {
    const [usdA, usdB] = calculateUSDtokens(firstTokenSelected.symbolPair, secondTokenSelected.symbolPair, amountA, amountB)

    setValueAUSD(isNaN(parseFloat(usdA)) ? '0.00' : usdA)
    setValueBUSD(isNaN(parseFloat(usdB)) ? '0.00' : usdB)
  }

  async function onConnect() {
    onConnectWallet()
  }

  function onSwitchTokensHandler() {
    onSwitchTokens()

    if (lastChanged == 'A') {
      changeTokenB(amountSwapTokenA)
      setLastChanged('B')
    } else if (lastChanged == 'B') {
      changeTokenA(amountSwapTokenB)
      setLastChanged('A')
    }
  }

  const calculateTotalLP = (token0, token1) => {
    const filter = getPoolList().filter(r => r.token0Symbol === token0 && r.token1Symbol === token1)
    if (filter.length > 0) {
      const userLP = new BigNumber(filter[0].totalSupply).toFixed(filter[0].decimals)
      return userLP
    }

    const filter2 = getPoolList().filter(r => r.token1Symbol === token0 && r.token0Symbol === token1)
    if (filter2.length > 0) {
      const userLP = new BigNumber(filter2[0].totalSupply).toNumber().toFixed(filter[0].decimals)
      return userLP
    }
  }

  function resetAll() {
    amountSwapTokenASetter(0)
    amountSwapTokenBSetter(0)
  }

  async function updateLiquidityDetail(tokenA, tokenB, value = amountSwapTokenA, token = firstTokenSelected) {
    const {
      reserve0, 
      reserve1,
    } = findReservesBySymbols(tokenA.symbol, tokenB.symbol)

    const getLiquidityDetailP = getLiquidityDetails(
      tokenA,
      tokenB,
      reserve0,
      reserve1,
      value,
      token,
      slippageTolerance,
      feeToPay
    )
    const ps = [getLiquidityDetailP]

    const [getLiquidityDetailResponse] = await Promise.all(ps)

    const {
      tokensToTransfer,
      exchangeRateA,
      exchangeRateB,
      firstReserve,
      secondReserve,
    } = getLiquidityDetailResponse
    exchangeRateASetter(exchangeRateA)
    exchangeRateBSetter(exchangeRateB)
    setFirstReserve(firstReserve)
    setSecondReserve(secondReserve)

    calculateUSDValues(value, tokensToTransfer)
    return tokensToTransfer
  }

  async function requestIncreaseAllowance(amount, contractHash) {
    console.log("requestIncreaseAllowance")
    await onIncreaseAllow(amount, contractHash)
    await updateLiquidityDetail(firstTokenSelected, secondTokenSelected)
  }

  async function changeTokenA(value: string) {
    let filteredValue = parseFloat(value)
    if (isNaN(filteredValue)) {
      filteredValue = 0
    } else if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue)
    }

    amountSwapTokenASetter(filteredValue)
    const minTokenToReceive = await updateLiquidityDetail(firstTokenSelected, secondTokenSelected, filteredValue, firstTokenSelected)
    amountSwapTokenBSetter(minTokenToReceive)

    const totalLP = calculateTotalLP(firstTokenSelected.symbolPair, secondTokenSelected.symbolPair)
    setTotalLiquidity(totalLP)
  }

  async function changeTokenB(value) {
    let filteredValue = parseFloat(value)
    if (isNaN(filteredValue)) {
      filteredValue = 0
    } else if (filteredValue < 0) {
      filteredValue = Math.abs(filteredValue)
    }

    amountSwapTokenBSetter(filteredValue)
    const minTokenToReceive = await updateLiquidityDetail(secondTokenSelected, firstTokenSelected, value, secondTokenSelected)
    amountSwapTokenASetter(minTokenToReceive)

    const totalLP = calculateTotalLP(firstTokenSelected.symbolPair, secondTokenSelected.symbolPair)
    setTotalLiquidity(totalLP)
  }

  const [searchModalA, searchModalASetter] = useState(false)
  async function selectAndCloseTokenA(token) {
    if (token.symbol === secondTokenSelected.symbol) {
      return;
    }
    onSelectFirstToken(token)
    searchModalASetter(false)

    const minTokenToReceive = await updateLiquidityDetail(token, secondTokenSelected, amountSwapTokenA, token)
    amountSwapTokenBSetter(minTokenToReceive)
  }
  const [searchModalB, searchModalBSetter] = useState(false)
  async function selectAndCloseTokenB(token) {
    if (token.symbol === firstTokenSelected.symbol) {
      return;
    }
    onSelectSecondToken(token)
    searchModalBSetter(false)

    const minTokenToReceive = await updateLiquidityDetail(firstTokenSelected, token, amountSwapTokenB, token)
    amountSwapTokenASetter(minTokenToReceive)
  }

  function makeHalf(amount, Setter) {
    Setter(amount / 2)
  }
  function makeMax(amount, Setter) {
    Setter(amount)
  }

  async function onLiquidity() {

    await onAddLiquidity(amountSwapTokenA, amountSwapTokenB, slippageTolerance, gasFee)
    resetAll()
  }

  const disableButton = (amount0, amount1) => {
    if (!isConnected) {
      return true
    }
    if (parseFloat(amount0) <= 0 || parseFloat(amount0) > parseFloat(firstTokenSelected.amount.toString())) {
      return true
    }
    if (parseFloat(amount1) <= 0 || parseFloat(amount1) > parseFloat(secondTokenSelected.amount.toString())) {
      return true
    }
  }

  const freeAllowanceA = new BigNumber(firstTokenSelected.allowance || 0).minus(new BigNumber(amountSwapTokenA)).toNumber()

  const isApprovedA = firstTokenSelected.symbol === 'CSPR' || (
    firstTokenSelected.symbol !== 'CSPR' &&
    freeAllowanceA >= 0
  )

  const freeAllowanceB = new BigNumber(secondTokenSelected.allowance || 0).minus(new BigNumber(amountSwapTokenB)).toNumber()

  const isApprovedB = secondTokenSelected.symbol === 'CSPR' || (
    secondTokenSelected.symbol !== 'CSPR' &&
    freeAllowanceB >= 0
  )

  const userPairDataNonZero = userPairData.filter(v => parseFloat(v.balance) > 0)

  const refreshPrices = async () => {
    await refreshAll()
    await changeTokenA(amountSwapTokenA)
  }

  return (
    <ContainerLiquidityNSM>
      <ContainerSwapActionsNSM>
        <NewSwapContainerNSM>
          <TokenSelectNSM>
            <NewTokenDetailSelectNSM>
              <NewTokenDetailItems1NSM handleClick={() => searchModalASetter(true)}>from</NewTokenDetailItems1NSM>
              <NewTokenDetailItems2NSM src={firstTokenSelected.logoURI} handleClick={() => searchModalASetter(true)}/>
              <NewTokenDetailItems3NSM handleClick={() => searchModalASetter(true)}>{firstTokenSelected.symbol}</NewTokenDetailItems3NSM>
              <NewTokenDetailItems4NSM>
                <ArrowContainerNSM>
                  <FlechaIcon onClick={() => { searchModalASetter(true) }} />
                  {searchModalA && <FloatMenu
                    excludedSymbols={[secondTokenSelected.symbol]}
                    tokens={tokens}
                    onSelectToken={selectAndCloseTokenA}
                    onClick={() => { searchModalASetter(false) }}
                  />}
                </ArrowContainerNSM>
              </NewTokenDetailItems4NSM>
            </NewTokenDetailSelectNSM>
          </TokenSelectNSM>
          <TokenSelectionNSM>
            <NewTokenDetailActionsNSM>
              <NewBalanceSpaceNSM>Balance: {firstTokenSelected.amount ? convertAllFormatsToUIFixedString(firstTokenSelected.amount, firstTokenSelected.decimals) : '--'}</NewBalanceSpaceNSM>
              <ActionContainerNSM>
                <ButtonHalfMaxContainer>
                  <ButtonHalfMax onClick={() => { makeHalf(firstTokenSelected.amount, changeTokenA) }}>Half</ButtonHalfMax>
                  <ButtonHalfMax onClick={() => { makeMax(firstTokenSelected.amount, changeTokenA) }}>Max</ButtonHalfMax>
                </ButtonHalfMaxContainer>
                <BalanceInputContainerNSM>
                  <BalanceInputItem1NSM>
                    <BalanceInputNSM
                      min={0}
                      onChange={(e) => { changeTokenA(e.target.value) }}
                      type="number" name="" id="" value={amountSwapTokenA} />
                  </BalanceInputItem1NSM>
                  <BalanceInputItem2NSM>
                    <p>$ {valueAUSD}</p>
                  </BalanceInputItem2NSM>
                </BalanceInputContainerNSM>
              </ActionContainerNSM>
            </NewTokenDetailActionsNSM>
          </TokenSelectionNSM>
        </NewSwapContainerNSM>
        <IconPlaceNSM>
          <SwitchSwap onClick={onSwitchTokensHandler} />
          <SwapDetailsNSM>
            <ExchangeRateBox
              tokenASymbol={firstTokenSelected.symbol}
              tokenBSymbol={secondTokenSelected.symbol}
              exchangeRateA={exchangeRateA}
              exchangeRateB={exchangeRateB}
            />
          </SwapDetailsNSM>
          <UpdatableCircle strokeWidth={12} handler={refreshPrices} />
        </IconPlaceNSM>
        {/*TODO: we need create another component with this background <NewSwapContainerNSM style={{backgroundColor: "white"}}>*/}
        <NewSwapContainerNSM>
          <TokenSelectNSM>
            <NewTokenDetailSelectNSM>
              <NewTokenDetailItems1NSM handleClick={() => searchModalASetter(true)}>to</NewTokenDetailItems1NSM>
              <NewTokenDetailItems2NSM src={secondTokenSelected.logoURI} handleClick={() => searchModalASetter(true)}/>
              <NewTokenDetailItems3NSM handleClick={() => searchModalASetter(true)}>{secondTokenSelected.symbol}</NewTokenDetailItems3NSM>
              <NewTokenDetailItems4NSM>
                <ArrowContainerNSM>
                  <FlechaIcon onClick={() => { searchModalBSetter(true) }} />
                  {searchModalB && <FloatMenu
                    excludedSymbols={[firstTokenSelected.symbol]}
                    tokens={tokens}
                    onSelectToken={selectAndCloseTokenB}
                    onClick={() => { searchModalBSetter(false) }}
                  />}
                </ArrowContainerNSM>
              </NewTokenDetailItems4NSM>
            </NewTokenDetailSelectNSM>
          </TokenSelectNSM>
          <TokenSelectionNSM>
            <NewTokenDetailActionsNSM>
              <NewBalanceSpaceNSM>Balance: {firstTokenSelected.amount ? convertAllFormatsToUIFixedString(secondTokenSelected.amount, firstTokenSelected.decimals) : '--'}</NewBalanceSpaceNSM>
              <ActionContainerNSM>
                <ButtonHalfMaxContainer>
                  <ButtonHalfMax onClick={() => { makeHalf(secondTokenSelected.amount, changeTokenB) }}>Half</ButtonHalfMax>
                  <ButtonHalfMax onClick={() => { makeMax(secondTokenSelected.amount, changeTokenB) }}>Max</ButtonHalfMax>
                </ButtonHalfMaxContainer>
                <BalanceInputContainerNSM>
                  <BalanceInputItem1NSM>
                    <BalanceInput
                      min={0}
                      onChange={(e) => { changeTokenB(e.target.value) }}
                      type="number" name="" id="" value={amountSwapTokenB} />
                  </BalanceInputItem1NSM>
                  <BalanceInputItem2NSM>
                    <p>$ {valueBUSD}</p>
                  </BalanceInputItem2NSM>
                </BalanceInputContainerNSM>
              </ActionContainerNSM>
            </NewTokenDetailActionsNSM>
          </TokenSelectionNSM>
        </NewSwapContainerNSM>
        {
          amountSwapTokenA > 0 &&
          <LPDetail
            firstSymbolToken={firstTokenSelected.symbol}
            secondSymbolToken={secondTokenSelected.symbol}
            secondTokenAmount={amountSwapTokenB}
            liquidity={parseFloat(totalLiquidity)}
            firstReserve={currentFReserve}
            secondReserve={currentSReserve}
            gasFee={gasFee}
            gasFeeSetter={gasFeeSetter}
            gasFeeEnabled={true}
            slippage={slippageTolerance}
            slippageEnabled={true}
            slippageSetter={updateSlippageTolerance} />
        }
        <ButtonSpaceNSM>
          {
            !isConnected &&
              <NewSwapButtonWidth100 content="Connect to Wallet" handler={async () => { onConnect() }} />
          }
          {
            !isApprovedA && isConnected &&
            <NewSwapButtonWidth100 disabled={disableButton(amountSwapTokenA, amountSwapTokenB)} content={`Approve ${-freeAllowanceA} ${firstTokenSelected.symbol}`} handler={async () => { await requestIncreaseAllowance(-freeAllowanceA, firstTokenSelected.contractHash) }} />
          }
          {
            !isApprovedB && isConnected &&
            <NewSwapButtonWidth100 disabled={disableButton(amountSwapTokenA, amountSwapTokenB)} content={`Approve ${-freeAllowanceB} ${secondTokenSelected.symbol}`} handler={async () => { await requestIncreaseAllowance(-freeAllowanceB, secondTokenSelected.contractHash) }} />
          }
          {
            isApprovedA && isApprovedB && isConnected && <NewSwapButtonWidth100 disabled={disableButton(amountSwapTokenA, amountSwapTokenB)} content="Add Liquidity" handler={async () => { await onLiquidity() }} />
          }
        </ButtonSpaceNSM>

      </ContainerSwapActionsNSM>
      {
        isConnected && userPairDataNonZero.length > 0 &&
        <ContainerLiquidityPoolList>
          {
            // Loop over the table rows
            userPairDataNonZero.map(row => {
              const openPopup = isOpenedRemoving && row.token0Symbol === firstTokenSelected.symbolPair && row.token1Symbol === secondTokenSelected.symbolPair

              console.log('zzzzzz', new BigNumber(row.reserve0).toFixed(row.decimals))

              return (
                // Apply the row props
                <LiquidityItem
                  key={`${row.token0Symbol}-${row.token1Symbol}`}
                  fullExpanded={openPopup}
                  firstIcon={row.token0Icon}
                  firstSymbol={row.token0Symbol}
                  firstLiquidity={new BigNumber(row.reserve0).toFixed(row.decimals)}
                  secondIcon={row.token1Icon}
                  secondSymbol={row.token1Symbol}
                  secondLiquidity={new BigNumber(row.reserve1).toFixed(row.decimals)}
                  liquidity={row.balance}
                  perLiquidity={new BigNumber(row.balance).div(row.totalSupply).times(100).toFixed(row.decimals)}
                >
                  <LiquidityRemovingWithInputRangeModule
                    isConnected={true}
                    openedPopup={openPopup}
                    firstName={row.token0Name}
                    firstHash={row.contract0}
                    firstSymbol={row.token0Symbol}
                    firstLiquidity={row.reserve0}
                    firstPrice={row.token0Price}
                    secondName={row.token1Name}
                    secondHash={row.contract1}
                    secondSymbol={row.token1Symbol}
                    secondLiquidity={row.reserve1}
                    secondPrice={row.token1Price}
                    contractHash={row.contractHash}
                    packageHash={row.packageHash}
                    liquidity={row.balance}
                    allowance={row.allowance}
                    firstIcon={row.token0Icon}
                    secondIcon={row.token1Icon}
                    decimals={row.decimals}
                  >
                    <CircleButton>
                      <TrashIcon />
                    </CircleButton>
                  </LiquidityRemovingWithInputRangeModule>
                </LiquidityItem>
              )
            })
          }
        </ContainerLiquidityPoolList>
      }
    </ContainerLiquidityNSM>
  )
}

export default LiquidityNewModule