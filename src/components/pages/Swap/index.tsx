import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { CardContainer, CloseButtonAtom, ConfirmSwapButton, HeaderModalAtom, SearchSectionAtom, SwapButton, SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect, SwitchIcon } from '../../atoms'
import { SwapModule } from '../../organisms'

import { BasicLayout } from '../../../layout/Basic'
import { SwapConfirmAtom, SwapModal, SwapSelection, SwapTokens } from '../../molecules'
import { TokensProviderContext } from '../../../contexts/TokensContext'
import { AiOutlineClose } from 'react-icons/ai'
import { SearchInputAtom } from '../../atoms/SearchInputAtom'
import { SwapToken } from '../../molecules/SwapToken'
import { SwapProviderContext } from '../../../contexts/SwapContext'
import { getStateRootHash, torusLogin } from '../../../reducers/WalletReducers/functions'
import { v4 as uuidv4 } from 'uuid';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

import { AccessRights, CasperServiceByJsonRPC, CLByteArray, CLKey, CLOption, CLPublicKey, CLValueBuilder, RuntimeArgs, Signer } from 'casper-js-sdk';
import { clientDispatcher, getActivePublicKey, signerLogIn } from '../../../reducers/WalletReducers/signerFunctions'
import { getStatus, swapMakeDeploy, updateBalances } from '../../../commons/swap'
import { BASE_URL, DEADLINE, PAYMENT_AMOUNT } from '../../../constant'
//const casperService = new CasperServiceByJsonRPC(torus?.provider);
import toast from 'react-hot-toast';
const errorToast = (msg) => toast.error(msg);
const successToast = (msg) => toast.success(msg);
const loadingToast = (msg) => toast.loading(msg);


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
  const { tokenState, tokenDispatch } = useContext(TokensProviderContext)
  const { tokens, firstTokenSelected, secondTokenSelected } = tokenState
  const { swapState, swapDispatch } = useContext(SwapProviderContext)
  const { isUserLogged, walletAddress, casperService, slippageTolerance } = swapState
  let [mainPurse, setMainPurse] = useState();
  let [count, countSetter] = useState(0);

  let balanceLoad;
  useEffect(() => {
    getStatus(casperService, walletAddress, setMainPurse)
      .then(balance => {
        tokenDispatch({ type: 'LOAD_BALANCE', payload: { name: "CSPR", data: balance } })
        toast.dismiss(balanceLoad)
        successToast("Balance load successfully")
        updateBalances(walletAddress, tokens, axios, tokenDispatch, successToast, secondTokenSelected)
      })
      .catch(err => console.log)
  }, [casperService,count])

  function onConnect() {
    Signer.getActivePublicKey().then((walletAddress) => {
      updateBalances(walletAddress, tokens, axios, tokenDispatch, successToast, secondTokenSelected)
      swapDispatch({ type: 'LOGIN', payload: { walletAddress, casperService: clientDispatcher() } })
      successToast("Wallet is connected")
      balanceLoad = loadingToast("Your balance will be load...")
    }).catch(err => {
      errorToast("Allow the site or unlock your wallet first!")
      Signer.sendConnectionRequest()
    })
  }



  async function onConfirmSwap() {
    const toastLoading = loadingToast("Waiting for confirmation...")
    const algo = await swapMakeDeploy(walletAddress,
      DEADLINE,
      10_000_000_000,
      amoutSwapTokenA,
      amoutSwapTokenB,
      firstTokenSelected.symbolPair,
      secondTokenSelected.symbolPair,
      slippSwapToken,
      mainPurse,
      axios,
      toastLoading,
      countSetter);
    setActiveModalSwap(false);
  }

  async function calculateReserves(value) {
    axios.post(`${BASE_URL}/getpathreserves`, {
      path: [
        firstTokenSelected.symbolPair,
        secondTokenSelected.symbolPair,
      ]
    }).then(response => {
      if (response.data.success) {
        const tokenB = parseFloat((value * parseFloat(response.data.reserve0)).toString().slice(0, 5))
        const slip = (tokenB - (tokenB * 0.5) / 100).toString().slice(0, 5)
        amoutSwapTokenBSetter(tokenB)
        slippSwapTokenSetter(slip)
      }
    })
  }

  function onChangeValueToken(value) {
    amoutSwapTokenASetter(value)
    calculateReserves(value)
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
                        const handleToken = () => { tokenDispatch({ type: 'SELECT_FIRST_TOKEN', payload: tokens[key] }), handleModalPrimary() }

                        return <SwapToken key={uuidv4()} token={tokens[key]} handleToken={handleToken} />
                      })
                  }
                </SwapTokens>

              </SwapContainerAtom>
            </SwapModal>
          }
          <SwitchIcon switchHandler={tokenDispatch} secondTokenSelected={secondTokenSelected} firstTokenSelected={firstTokenSelected} />
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
                        const handleToken = () => { tokenDispatch({ type: 'SELECT_SECOND_TOKEN', payload: tokens[key] }), handleModalSecondary() }
                        return <SwapToken key={uuidv4()} token={tokens[key]} handleToken={handleToken} />
                      })
                  }
                </SwapTokens>
              </SwapContainerAtom>
            </SwapModal>
          }
          {!isUserLogged && <SwapButton content="Connect to Wallet" handler={async () => { onConnect() }} />}
          {isUserLogged && <p>Slippage Tolerance: {slippageTolerance}%</p>}
          {isUserLogged && <SwapButton content="Swap" handler={async () => { setActiveModalSwap(true) }} />}
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