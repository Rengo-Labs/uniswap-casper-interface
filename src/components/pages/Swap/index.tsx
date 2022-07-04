import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { CardContainer, CloseButtonAtom, ConfirmSwapButton, HeaderModalAtom, SearchSectionAtom, SwapButton, SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect, SwitchIcon } from '../../atoms'
import { SwapModule } from '../../organisms'

import { BasicLayout } from '../../../layout/Basic'
import { SwapConfirmAtom, SwapModal, SwapSelection, SwapTokens } from '../../molecules'
import { AiOutlineClose } from 'react-icons/ai'
import { SearchInputAtom } from '../../atoms/SearchInputAtom'
import { SwapToken } from '../../molecules/SwapToken'
import { SwapProviderContext } from '../../../contexts/SwapContext'
import { v4 as uuidv4 } from 'uuid';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

import { BASE_URL, DEADLINE, PAYMENT_AMOUNT } from '../../../constant'

import { ConfigProviderContext } from '../../../contexts/ConfigContext'


export const Swap = () => {
  //const query = useQuery()
  //const tokenOne = query.get("tokenOne")
  const [activeModalPrimary, setActiveModalPrimary] = React.useState(false)
  const [activeModalSecondary, setActiveModalSecondary] = React.useState(false)
  const [activeModalSwap, setActiveModalSwap] = React.useState(false)
  const [amoutSwapTokenA, amoutSwapTokenASetter] = useState<any>(0)
  const [amoutSwapTokenB, amoutSwapTokenBSetter] = useState<any>(0)
  const [slippSwapToken, slippSwapTokenSetter] = useState<any>(0)

  const handleModalPrimary = () => {
    setActiveModalPrimary(!activeModalPrimary)
  }
  const handleModalSecondary = () => {
    setActiveModalSecondary(!activeModalSecondary)
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
    onCalculateReserves } = useContext(ConfigProviderContext)

  function onConnect() {
    onConnectConfig()
  }

  async function onConfirmSwap() {
    const waiting = await onConfirmSwapConfig(amoutSwapTokenA, amoutSwapTokenB)
    amoutSwapTokenASetter(0)
    setActiveModalSwap(false);
    // const algo = await swapMakeDeploy(walletAddress,
    //   DEADLINE,
    //   10_000_000_000,
    //   amoutSwapTokenA,
    //   amoutSwapTokenB,
    //   firstTokenSelected.symbolPair,
    //   secondTokenSelected.symbolPair,
    //   slippSwapToken,
    //   mainPurse,
    //   axios,
    //   toastLoading
    // );

  }



  async function onChangeValueToken(value) {
    amoutSwapTokenASetter(value)
    const { secondTokenReturn, minAmountReturn } = await onCalculateReserves(value)
    amoutSwapTokenBSetter(secondTokenReturn)
    slippSwapTokenSetter(minAmountReturn)
  }

  return (
    <BasicLayout>
      <CardContainer cardTitle="Swap">
        <SwapModule >
          <SwapContainer>
            <SwapTokenSelect onClickHandler={handleModalPrimary} token={firstTokenSelected}></SwapTokenSelect>
            <SwapTokenBalance token={firstTokenSelected} amoutSwapTokenSetter={onChangeValueToken} />
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
          <SwitchIcon switchHandler={onSwitchTokens} secondTokenSelected={secondTokenSelected} firstTokenSelected={firstTokenSelected} />
          <SwapContainer>
            <SwapTokenSelect onClickHandler={handleModalSecondary} token={secondTokenSelected}></SwapTokenSelect>
            <SwapTokenBalance disabled={true} token={secondTokenSelected} amoutSwapTokenSetter={amoutSwapTokenBSetter} amoutSwapToken={amoutSwapTokenB} />
          </SwapContainer>
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
                  amoutSwapTokenA={amoutSwapTokenA}
                  amoutSwapTokenB={amoutSwapTokenB}
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