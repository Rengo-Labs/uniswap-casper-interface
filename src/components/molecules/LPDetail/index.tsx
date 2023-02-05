import React, { useState } from 'react';
import useCollapse from 'react-collapsed';
import {
  CollapsingContainerStyled,
  CollapsingRow,
  CollapsingColumnLeft,
  CollapsingColumnRight,
  CollapsingHeader,
  CollapsingBody,
} from './styles';

import { RouterBox, SlippageBox } from '../../atoms';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import { GasFeeBox } from '../../atoms/GasFeeBox';

interface LPDetailProps {
  firstSymbolToken?: string;
  secondSymbolToken?: string;
  secondTokenAmount?: number;
  liquidity?: number;
  firstReserve?: number;
  secondReserve?: number;
  gasFee?: number;
  gasFeeSetter?(any): void;
  gasFeeEnabled?: boolean;
  slippage?: number;
  slippageSetter?(any): void;
  className?: string;
  fullExpanded?: boolean;
  slippageEnabled?: boolean;
}

export const LPDetail = ({
  firstSymbolToken = 'CSPR',
  secondSymbolToken = 'ETH',
  secondTokenAmount = 200,
  liquidity = 10,
  firstReserve = 0.0,
  secondReserve = 0.0,
  gasFee = 10,
  gasFeeSetter = () => {},
  gasFeeEnabled = false,
  slippage = 0.005,
  slippageSetter = () => {},
  className = '',
  fullExpanded = false,
  slippageEnabled = false,
}: LPDetailProps) => {
  const [isExpanded, setExpanded] = useState(fullExpanded);

  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  const handleOnClick = () => {
    setExpanded(!isExpanded);
  };

  const updateSlippage = (event) => {
    slippageSetter(event.target.value);
  };

  return (
    <CollapsingContainerStyled className={className}>
      <CollapsingBody>
        <CollapsingRow>
          <CollapsingColumnLeft>Base</CollapsingColumnLeft>
          <CollapsingColumnRight>{firstSymbolToken}</CollapsingColumnRight>
        </CollapsingRow>
        <CollapsingRow>
          <CollapsingColumnLeft>Min Amount</CollapsingColumnLeft>
          <CollapsingColumnRight>
            {(secondTokenAmount * (1 - slippage / 100)).toFixed(9)}{' '}
            {secondSymbolToken}
          </CollapsingColumnRight>
        </CollapsingRow>
        <CollapsingRow>
          <CollapsingColumnLeft>
            Pool Liquidity ({firstSymbolToken})
          </CollapsingColumnLeft>
          <CollapsingColumnRight>
            {firstReserve} {firstSymbolToken}
          </CollapsingColumnRight>
        </CollapsingRow>
        <CollapsingRow>
          <CollapsingColumnLeft>
            Pool Liquidity ({secondSymbolToken}){' '}
          </CollapsingColumnLeft>
          <CollapsingColumnRight>
            {secondReserve} {secondSymbolToken}
          </CollapsingColumnRight>
        </CollapsingRow>
        <CollapsingRow>
          <CollapsingColumnLeft>LP supply</CollapsingColumnLeft>
          <CollapsingColumnRight data-testid='collapsing_min_received'>
            {liquidity} {firstSymbolToken}-{secondSymbolToken}
          </CollapsingColumnRight>
        </CollapsingRow>

        <CollapsingRow>
          {/* TODO: remove inline css*/}
          <div style={{ width: '100%' }} className='collapsible'>
            <div {...getCollapseProps()}>
              <CollapsingRow>
                <SlippageBox
                  slippageEnabled={slippageEnabled}
                  onSlippageChange={updateSlippage}
                  slippage={slippage}
                />
              </CollapsingRow>
              <CollapsingRow>
                <GasFeeBox
                  gasFeeEnabled={gasFeeEnabled}
                  onGasFeeChange={gasFeeSetter}
                  gasFee={gasFee}
                />
              </CollapsingRow>
              <CollapsingRow>
                <RouterBox
                  tokenASymbol={firstSymbolToken}
                  tokenBSymbol={secondSymbolToken}
                />
              </CollapsingRow>
            </div>
            <CollapsingHeader
              data-testid='collapsing_id'
              {...getToggleProps({ onClick: handleOnClick })}
            >
              {/* TODO: remove inline css*/}
              <CollapsingRow
                style={{ paddingTop: '0', color: 'rgba(120, 100, 244, 1)', cursor: 'pointer', marginTop: `${isExpanded ? '15px' : '0'}` }}
              >
                {isExpanded ? 'Show less' : 'More information'}{' '}
                {isExpanded ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
              </CollapsingRow>
            </CollapsingHeader>
          </div>
        </CollapsingRow>
      </CollapsingBody>
    </CollapsingContainerStyled>
  );
};
