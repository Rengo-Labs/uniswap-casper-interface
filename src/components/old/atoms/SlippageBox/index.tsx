import React from "react";
import {
  SlippageContainer,
  SlippageColumnLeft,
  SlippageColumnRight,
  Input,
  Span,
} from "./styles";

interface SlippageBoxProps {
  slippage: number;
  onSlippageChange:any;
  slippageEnabled?: boolean;
  className?: string;
}

export const SlippageBox = ({
  onSlippageChange,
  slippage,
  slippageEnabled = false,
  className,
}: SlippageBoxProps) => {
  return (
    <SlippageContainer className={className}>
      <SlippageColumnLeft>Slippage tolerance</SlippageColumnLeft>
      <SlippageColumnRight>
        {slippageEnabled && (
          <label>
            <Input
              onChange={onSlippageChange}
              value={slippage}
              type="number"
              placeholder="%"
            />
            <Span>%</Span>
          </label>
        )}
        {!slippageEnabled && <div>{slippage} %</div>}
      </SlippageColumnRight>
    </SlippageContainer>
  );
};
