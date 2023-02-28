import React, { useContext, useState } from 'react';
import useCollapse from 'react-collapsed';
import {
  TBodyExpanded,
  TColumn1,
  TRow,
  TWrapRow,
  WrappedRow,
  CircleButton,
  SymbolContainer,
  TColumn1WithColor,
  TBodyExpandedDiv,
  TBodyExpandedDivBorder,
  SwapIconImageStyled,
  SwapIconImageStyledRelative,
} from "./styles";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { IconOutlineSwap, LiquidityButton, LiquidityFarmIcon, NewIcons } from "../../atoms";
import { useNavigate } from "react-router-dom";
import { ConfigProviderContext } from "../../../contexts/ConfigContext";
import {TokensProviderContext} from "../../../contexts/TokensContext";

export const LiquidityItem = ({ firstIcon, firstSymbol, firstLiquidity, secondIcon, secondSymbol, secondLiquidity, liquidity, perLiquidity, fullExpanded = false, children }: any) => {
  const [isExpanded, setExpanded] = useState(fullExpanded);
  const navigate = useNavigate()
  const {
    onSelectFirstToken,
    onSelectSecondToken,
    tokenState
  } = useContext(TokensProviderContext)
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  const handleOnClick = () => {
    setExpanded(!isExpanded);
  }

  const selectLiquidity = () => {
    onSelectFirstToken(tokenState.tokens[firstSymbol.replace('WCSPR', 'CSPR')])
    onSelectSecondToken(tokenState.tokens[secondSymbol.replace('WCSPR', 'CSPR')])
  }

  const goTo = (path) => {
    navigate({ pathname: path, search: `token0=${firstSymbol}&token1=${secondSymbol}` })
  }

  return (
    <TWrapRow className="collapsible">
      <TRow {...getToggleProps({ onClick: handleOnClick })}>
        <TColumn1>
          <TColumn1>
            <SwapIconImageStyled src={firstIcon} width="30" height="30" />
            <SwapIconImageStyledRelative src={secondIcon} width="30" height="30" />
          </TColumn1>
          <SymbolContainer>{firstSymbol}-{secondSymbol}</SymbolContainer>
        </TColumn1>
        <TColumn1WithColor>{isExpanded ? <TiArrowSortedUp /> : <TiArrowSortedDown />}</TColumn1WithColor>
      </TRow>
      <TBodyExpanded {...getCollapseProps()}>
        <TBodyExpandedDiv>
          <TBodyExpandedDivBorder />
        </TBodyExpandedDiv>
        <WrappedRow>
          <TColumn1>
            Pooled ({firstSymbol})
          </TColumn1>
          <TColumn1WithColor>
            {firstLiquidity} {firstSymbol}
          </TColumn1WithColor>
        </WrappedRow>
        <WrappedRow>
          <TColumn1>
            Pooled ({secondSymbol})
          </TColumn1>
          <TColumn1WithColor>
            {secondLiquidity} {secondSymbol}
          </TColumn1WithColor>
        </WrappedRow>
        <WrappedRow>
          <TColumn1>
            Your liquidity
          </TColumn1>
          <TColumn1WithColor>
            {liquidity} LP
          </TColumn1WithColor>
        </WrappedRow>
        <WrappedRow>
          <TColumn1>
            Your share
          </TColumn1>
          <TColumn1WithColor>
            {perLiquidity} %
          </TColumn1WithColor>
        </WrappedRow>
        <WrappedRow>
          <TColumn1>
            <TRow>
              <LiquidityButton content={'Add Liquidity'} handler={selectLiquidity} />
            </TRow>
          </TColumn1>
          <TColumn1>
            <TRow>
              <CircleButton onClick={() => { goTo("/swap") }}>
                <IconOutlineSwap size="1.3rem" />
              </CircleButton>
              {children}
              {false &&
                <CircleButton onClick={() => { }}>
                  <LiquidityFarmIcon />
                </CircleButton>
              }
            </TRow>
          </TColumn1>
        </WrappedRow>
      </TBodyExpanded>
    </TWrapRow>
  );
}
