import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { CardContainer, CloseButtonAtom, HeaderModalAtom, SearchSectionAtom, SwapButton, SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect, SwitchIcon } from '../../atoms'
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
import { clientDispatcher, signerLogIn } from '../../../reducers/WalletReducers/signerFunctions'
//const casperService = new CasperServiceByJsonRPC(torus?.provider);


export const Swap = () => {
  //const query = useQuery()
  //const tokenOne = query.get("tokenOne")
  const [activeModalPrimary, setActiveModalPrimary] = React.useState(false)
  const [activeModalSecondary, setActiveModalSecondary] = React.useState(false)


  const handleModalPrimary = () => {
    setActiveModalPrimary(!activeModalPrimary)
  }
  const handleModalSecondary = () => {
    setActiveModalSecondary(!activeModalSecondary)
  }
  const { tokenState, tokenDispatch } = useContext(TokensProviderContext)
  const { tokens, firstTokenSelected, secondTokenSelected } = tokenState

  const { swapState, swapDispatch } = useContext(SwapProviderContext)
  const { isUserLogged, torus, walletAddress, casperService } = swapState

  async function onConnect() {
    const walletAddress = await signerLogIn(Signer)
    swapDispatch({ type: 'LOGIN', payload: { walletAddress, casperService: clientDispatcher() } })
    setTimeout(async () => { await getStatus() }, 1500)
  }

  async function getStatus() {
    const stateRootHash = await casperService.getStateRootHash();
    const result = await casperService.getBlockState(
      stateRootHash,
      CLPublicKey.fromHex(walletAddress).toAccountHashStr(),
      []
    )
    const balance = await casperService.getAccountBalance(
      stateRootHash,
      result.Account.mainPurse
    )
    const real = balance / 10 ** 9
    console.log("real", real)
    return real.toString()
  }

  async function onSign() {
    const message = Buffer.from("Test Signing Message ", "utf8");
    const signed_message = await torus.signMessage({
      message: "message",
      from: "string"
    });
  }

  return (
    <BasicLayout>
      <CardContainer cardTitle="Swap">
        <SwapModule >
          <SwapContainer>
            <SwapTokenSelect onClickHandler={handleModalPrimary} token={firstTokenSelected}></SwapTokenSelect>
            <SwapTokenBalance />
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
            <SwapTokenBalance />
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
                        const filter = new RegExp(firstTokenSelected.fullname.acron)
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
          {isUserLogged && <SwapButton content="Sign Message" handler={async () => { await onSign() }} />}
          <button onClick={getStatus}>status</button>


        </SwapModule>
      </CardContainer >
    </BasicLayout>
  )
}