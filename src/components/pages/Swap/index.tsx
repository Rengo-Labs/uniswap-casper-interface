import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { CardContainer, CloseButtonAtom, ConfirmSwapButton, HeaderModalAtom, SearchSectionAtom, SwapButton, SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect, SwitchIcon } from '../../atoms'
import { SwapModule } from '../../organisms'

import { BasicLayout } from '../../../layout/Basic'
import { SwapModal, SwapSelection, SwapTokens } from '../../molecules'
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
import { swapMakeDeploy } from '../../../commons/swap'
import { BASE_URL, DEADLINE, PAYMENT_AMOUNT } from '../../../constant'
//const casperService = new CasperServiceByJsonRPC(torus?.provider);


export const Swap = () => {
  //const query = useQuery()
  //const tokenOne = query.get("tokenOne")
  const [activeModalPrimary, setActiveModalPrimary] = React.useState(false)
  const [activeModalSecondary, setActiveModalSecondary] = React.useState(false)
  const [activeModalSwap, setActiveModalSwap] = React.useState(false)
  const [amoutSwapTokenA, amoutSwapTokenASetter] = useState<any>(0)
  const [amoutSwapTokenB, amoutSwapTokenBSetter] = useState<any>(0)

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

  async function getStatus() {
    const stateRootHash = await casperService.getStateRootHash();
    const result = await casperService.getBlockState(
      stateRootHash,
      CLPublicKey.fromHex(walletAddress).toAccountHashStr(),
      []
    )
    setMainPurse(result.Account.mainPurse);
    const balance = await casperService.getAccountBalance(
      stateRootHash,
      result.Account.mainPurse
    )
    const real = balance / 10 ** 9
    return real.toString()
    
  }
  useEffect(() => {
    getStatus()
      .then(balance => {
        tokenDispatch({ type: 'LOAD_BALANCE', payload: { name: "CSPR", data: balance } })
      })
      .catch(err => console.log)
  }, [casperService])

  async function onConnect() {
    await signerLogIn(Signer)
    const walletAddress = await getActivePublicKey(Signer)
    updateBalances(walletAddress)
    swapDispatch({ type: 'LOGIN', payload: { walletAddress, casperService: clientDispatcher() } })
  }

  function updateBalances(walletAddress) {
    Object.keys(tokens).map(x => {
      if (tokens[`${x}`].contractHash.length > 0) {
        const param = {
          contractHash: tokens[`${x}`].contractHash.slice(5),
          user: Buffer.from(CLPublicKey.fromHex(walletAddress).toAccountHash()).toString("hex")
        }
        axios
          .post(`${BASE_URL}/balanceagainstuser`, param)
          .then((res) => {
            //console.log('balanceagainstuser', res)
            console.log("resdata",res.data)
            //holdArr[i].balance = res.data.balance;
            // setTokenBBalance(res.data.balance)

          })
          .catch((error) => {
            console.log(error)
            console.log(error.response)
          })
      }

    })

  }

  async function onConfirmSwap() {
    const algo = await swapMakeDeploy(walletAddress,
      DEADLINE,
      10_000_000_000,
      11_000_000_000,
      10_000_000_000,
      firstTokenSelected.symbolPair,
      secondTokenSelected.symbolPair,
      0.5,
      mainPurse,
      axios);
    setActiveModalSwap(false);
  }

  function calculateReserves(value) {
    axios.post(`${BASE_URL}/getpathreserves`, {
      path: [
        firstTokenSelected.symbolPair,
        secondTokenSelected.symbolPair,
      ]
    }).then(response => {
      if (response.data.success) {
        amoutSwapTokenBSetter(value * parseFloat(response.data.reserve0))
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
                <div>
                  <div>
                    <div>
                      <div>
                        <img src={firstTokenSelected.logoURI} width="50" height="50" />
                        <p>10000</p>
                      </div>
                      <p>{firstTokenSelected.name} </p>
                    </div>
                    <span>flecha</span>
                    <div>
                      <div>
                        <img src={secondTokenSelected.logoURI} width="50" height="50" />
                        <p>10000</p>
                      </div>
                      <p>{secondTokenSelected.name} </p>
                    </div>
                  </div>
                  <div>output is estimated. you will receive at least 6.92697 CSPR or the transaction will revert</div>
                  <div>
                    <div>
                      <p>Price</p>
                      <p>{`67.6765 ${firstTokenSelected.symbol}/${secondTokenSelected.symbol}`}</p>
                    </div>
                  </div>
                  <ConfirmSwapButton content="Confirm Swap" handler={async () => { await onConfirmSwap() }} />
                </div>

              </SwapContainerAtom>
            </SwapModal>
          }

        </SwapModule>
      </CardContainer >
    </BasicLayout>
  )
}