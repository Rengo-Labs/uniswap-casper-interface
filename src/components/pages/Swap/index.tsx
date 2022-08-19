import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import {
  CardContainer, CloseButtonAtom, ConfirmSwapButton, HeaderModalAtom, SearchSectionAtom, SwapButton,
  SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect,
  SearchInputAtom
} from '../../atoms'
import { SwapModule } from '../../organisms'

import { BasicLayout } from '../../../layout/Basic'
import { SwapConfirmAtom, SwapModal, SwapTokens, SwapToken, SwitchBox, CollapsingBox } from '../../molecules'
import { AiOutlineClose } from 'react-icons/ai'
import { v4 as uuidv4 } from 'uuid';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

import { ConfigProviderContext } from '../../../contexts/ConfigContext'

export const Swap = () => {
  //const query = useQuery()
  //const tokenOne = query.get("tokenOne")
  const [activeModalPrimary, setActiveModalPrimary] = React.useState(false)
  const [activeModalSecondary, setActiveModalSecondary] = React.useState(false)
  const [activeModalSwap, setActiveModalSwap] = React.useState(false)
  const [amountSwapTokenA, amountSwapTokenASetter] = useState<any>(0)
  const [amountSwapTokenB, amountSwapTokenBSetter] = useState<any>(0)
  const [slippSwapToken, slippSwapTokenSetter] = useState<any>(0)
  const [tokensToTransfer, tokensToTransferSetter] = useState<any>(0)
  const [priceImpact, priceImpactSetter] = useState<any>(0)
  const [feeToPay, feeToPaySetter] = useState<any>(0.03)
  const [exchangeRateA, exchangeRateASetter] = useState<any>(0)
  const [exchangeRateB, exchangeRateBSetter] = useState<any>(0)
  const [defaultPriceImpactLabel, defaultPriceImpactLabelSetter] = useState<any>('')
  const [switchMovement, switchMovementSetter] = useState(false)

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
    getSwapDetail
  } = useContext(ConfigProviderContext)

  function onConnect() {
    onConnectConfig()
  }


  async function onConfirmSwap() {
    const waiting = await onConfirmSwapConfig(amountSwapTokenA, amountSwapTokenB)
    amountSwapTokenASetter(0)
    setActiveModalSwap(false);
    onConnectConfig()
  }

  function onSwitch() {
    onSwitchTokens()
    amountSwapTokenASetter(0)
    amountSwapTokenBSetter(0)
  }

  function ResetTokens() {
    amountSwapTokenASetter(0)
    amountSwapTokenBSetter(0)
  }



  async function changeTokenA(value) {
    const { secondTokenReturn, minAmountReturn } = await onCalculateReserves(value,false)
    slippSwapTokenSetter(minAmountReturn)
    amountSwapTokenBSetter(secondTokenReturn)
    amountSwapTokenASetter(value)

    await updateSwapDetail(firstTokenSelected, secondTokenSelected, value)
  }

  async function changeTokenB(value) {
    const { secondTokenReturn, minAmountReturn } = await onCalculateReserves(value,true)
    slippSwapTokenSetter(minAmountReturn)
    amountSwapTokenASetter(secondTokenReturn)
    amountSwapTokenBSetter(value)

    await updateSwapDetail(secondTokenSelected, firstTokenSelected, value)
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
  }

  return (
      <BasicLayout>
        <CardContainer cardTitle="Swap">
          <SwapModule >
            <SwapContainer>
              <SwapTokenSelect onClickHandler={handleModalPrimary} token={firstTokenSelected}></SwapTokenSelect>
              <SwapTokenBalance token={firstTokenSelected} amountSwapTokenSetter={changeTokenA} amountSwapToken={amountSwapTokenA} />
            </SwapContainer>
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
                    <SwapTokens >
                      {
                        Object.keys(tokens)
                            .map((key) => {
                              const handleToken = () => { onSelectFirstToken(tokens[key]), handleModalPrimary() }

                              return <SwapToken key={uuidv4()} token={tokens[key]} handleToken={handleToken} />
                            })
                      }
                    </SwapTokens>

                  </SwapContainerAtom>
                </SwapModal>
            }

            <SwitchBox active={switchMovement}
                       onSwitch={onSwitch}
                       secondTokenSelected={secondTokenSelected}
                       firstTokenSelected={firstTokenSelected}
                       exchangeRateA={exchangeRateA}
                       exchangeRateB={exchangeRateB}
                       defaultPriceImpactLabel={defaultPriceImpactLabel}
            />

            <SwapContainer>
              <SwapTokenSelect onClickHandler={handleModalSecondary} token={secondTokenSelected}></SwapTokenSelect>
              <SwapTokenBalance token={secondTokenSelected} amountSwapTokenSetter={changeTokenB} amountSwapToken={amountSwapTokenB} />
            </SwapContainer>
            {
                amountSwapTokenB > 0 &&
                <CollapsingBox firstToken={amountSwapTokenA}
                               firstSymbolToken={firstTokenSelected}
                               receivedSymbolToken={secondTokenSelected}
                               tokensToTransfer={tokensToTransfer}
                               priceImpact={priceImpact}
                               slippage={slippSwapToken}
                               fee={feeToPay}
                               slippageSetter={slippSwapTokenSetter}
                />
            }
            {
                activeModalSecondary &&
                <SwapModal >
                  <SwapContainerAtom >
                    <SwapHeaderAtom>
                      <HeaderModalAtom>Select Token</HeaderModalAtom>
                      <CloseButtonAtom onClick={handleModalSecondary}>
                        <AiOutlineClose />
                      </CloseButtonAtom>
                    </SwapHeaderAtom>
                    <SearchSectionAtom>
                      <SearchInputAtom
                          placeholder="Search name"
                      />
                    </SearchSectionAtom>
                    <SwapTokens >
                      {
                        Object.keys(tokens)
                            .map((key) => {
                              const filter = new RegExp(firstTokenSelected.symbol)
                              if (filter.test(key)) { return }
                              const handleToken = () => { onSelectSecondToken(tokens[key]), handleModalSecondary() }
                              return <SwapToken key={uuidv4()} token={tokens[key]} handleToken={handleToken} />
                            })
                      }
                    </SwapTokens>
                  </SwapContainerAtom>
                </SwapModal>
            }
            {!isConnected && <SwapButton content="Connect to Wallet" handler={async () => { onConnect() }} />}
            {isConnected && <p>Slippage Tolerance: {slippageToleranceSelected}%</p>}
            {isConnected && <SwapButton content="Swap" handler={async () => { setActiveModalSwap(true) }} />}
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
                        firstTokenSelected={firstTokenSelected}
                        secondTokenSelected={secondTokenSelected}
                        amountSwapTokenA={amountSwapTokenA}
                        amountSwapTokenB={amountSwapTokenB}
                        slippSwapToken={slippSwapToken}
                    >
                      <ConfirmSwapButton content="Confirm Swap" handler={async () => { await onConfirmSwap() }} />
                    </SwapConfirmAtom>

                  </SwapContainerAtom>
                </SwapModal>
            }

          </SwapModule>
        </CardContainer >
      </BasicLayout>
  )
}