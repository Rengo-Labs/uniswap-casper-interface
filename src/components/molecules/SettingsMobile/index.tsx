import { useState } from 'react';
import {
  StyledSettingMenu,
  StyleSettingValue,
  StyleSettingValueContainer,
  StyleSettingValueInput,
  StyleSettingValueInputButton,
  StyleSettingValueInputButtonText,
  StyleSettingValueInputContainer,
  StyleTitle,
  Text,
} from './styles';
import { globalStore } from '../../../store/store';

export const SettingMobile = () => {
  const { updateSlippageTolerance, slippageTolerance } = globalStore();

  const [slippageToleranceValue, setSlippageToleranceValue] = useState<number>(
    slippageTolerance || 0
  );

  const handleSlippageTolerance = (value: any) => {
    setSlippageToleranceValue(value);
  };

  const handleSaveSlippageTolerance = () => {
    if (slippageToleranceValue !== 0) {
      updateSlippageTolerance(Number(slippageToleranceValue));
    }
  };

  return (
    <StyledSettingMenu>
      <StyleTitle>Slippage Tolerance</StyleTitle>
      <StyleSettingValueContainer>
        <StyleSettingValue
          customColor={slippageToleranceValue == 0.1}
          onClick={() => handleSlippageTolerance(0.1)}
        >
          0.1%
        </StyleSettingValue>
        <StyleSettingValue
          customColor={slippageToleranceValue == 0.5}
          onClick={() => handleSlippageTolerance(0.5)}
        >
          0.5%
        </StyleSettingValue>
        <StyleSettingValue
          customColor={slippageToleranceValue == 1.0}
          onClick={() => handleSlippageTolerance(1.0)}
        >
          1.0%
        </StyleSettingValue>
      </StyleSettingValueContainer>
      <StyleSettingValueInputContainer>
        <StyleSettingValueInput
          type='text'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleSlippageTolerance(e.target.value)
          }
          value={slippageToleranceValue}
        />
        <Text> %</Text>
      </StyleSettingValueInputContainer>
      <StyleSettingValueInputButton
        disabled={!slippageToleranceValue}
        onClick={() => handleSaveSlippageTolerance()}
      >
        <StyleSettingValueInputButtonText>
          Save
        </StyleSettingValueInputButtonText>
      </StyleSettingValueInputButton>
    </StyledSettingMenu>
  );
};
