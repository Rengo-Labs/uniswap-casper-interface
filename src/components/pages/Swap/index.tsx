import React from 'react'
import { useLocation } from 'react-router-dom'

import { CardContainer, CloseButtonAtom, HeaderModalAtom, SearchSectionAtom, SwapButton, SwapContainer, SwapContainerAtom, SwapHeaderAtom, SwapTokenBalance, SwapTokenSelect, SwitchIcon } from '../../atoms'
import { SwapModule } from '../../organisms'

import { BasicLayout } from '../../../layout/Basic'
import { SwapModal, SwapSelection, SwapTokens } from '../../molecules'
import { TokensProviderContext } from '../../../contexts/TokensContext'
import { AiOutlineClose } from 'react-icons/ai'
import { SearchInputAtom } from '../../atoms/SearchInputAtom'
import { SwapToken } from '../../molecules/SwapToken'

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}


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
  const { state, dispatch } = React.useContext(TokensProviderContext)
  const { tokens, firstTokenSelected, secondTokenSelected } = state
  return (
    <BasicLayout>
      <CardContainer cardTitle="Swap">
        <SwapModule >
          <SwapContainer>
            <SwapTokenSelect onClickHandler={handleModalPrimary} token={tokens["CSPR"]}></SwapTokenSelect>
            <SwapTokenBalance />
          </SwapContainer>
          {
            /*activeModalPrimary &&
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
                    tokens.map((token: any) => {
                      return <SwapToken key={token} icon={token.icon} token={token} amount={token.amount} setToken={dispatch("SELECT_FIRST_TOKEN")} handleModal={handleModalPrimary} />
                    })
                  }
                </SwapTokens>
              </SwapContainerAtom>
            </SwapModal>*/
          }
          {/*
          <SwitchIcon switchHandler={dispatch("SWITCH_TOKENS")} />
          <SwapContainer>
            <SwapTokenSelect onClickHandler={handleModalSecondary} token={secondTokenSelected}></SwapTokenSelect>
            <SwapTokenBalance />
          </SwapContainer>
          */}
          {
            /*
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
                    tokens.map((token: any) => {
                      return <SwapToken key={token} icon={token.icon} token={token} amount={token.amount} setToken={dispatch("SELECT_SECOND_TOKEN")} handleModal={handleModalSecondary} />
                    })
                  }
                </SwapTokens>
              </SwapContainerAtom>
            </SwapModal>
            */
          }
          {/**
           * <SwapButton content="Connect to Wallet"></SwapButton>
           */}
        </SwapModule>
      </CardContainer >
    </BasicLayout>
  )
}