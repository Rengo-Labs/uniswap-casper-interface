import { useReducer, useState } from 'react';
import { initialConfigState, ConfigReducer, ConfigActions } from '../../../reducers/ConfigReducers';
import {
  StyledSettingMenu,
  StyleSettingValue,
  StyleSettingValueContainer,
  StyleSettingValueInput,
  StyleSettingValueInputButton,
  StyleSettingValueInputButtonText,
  StyleSettingValueInputContainer,
  StyleTitle,
} from './styles';

export const SettingMenu = () => {

  const [state, dispatch] = useReducer(ConfigReducer, initialConfigState);
  
  const [slippageTolerance, setSlippageTolerance] = useState<number>(state.slippageToleranceSelected || 0);

  const handleSlippageTolerance = (value: number) => {
    setSlippageTolerance(value);
  };

  console.log('stateSettings', state.slippageToleranceSelected)

  const handleSaveSlippageTolerance = () => {
    if(slippageTolerance !== 0){
      dispatch({ type: ConfigActions.SELECT_SLIPPAGE, payload: { slippageToleranceSelected: slippageTolerance } });
    }
  };


  return (
    <StyledSettingMenu>
      <StyleTitle>Slippage Tolerance</StyleTitle>
      <StyleSettingValueContainer>
        <StyleSettingValue customColor={slippageTolerance == 0.1} onClick={() => handleSlippageTolerance(0.1)}>0.1%</StyleSettingValue>
        <StyleSettingValue customColor={slippageTolerance == 0.5} onClick={() => handleSlippageTolerance(0.5)}>0.5%</StyleSettingValue>
        <StyleSettingValue customColor={slippageTolerance == 1.0} onClick={() => handleSlippageTolerance(1.0)}>1.0%</StyleSettingValue>
        <StyleSettingValueInputContainer>
          <StyleSettingValueInput type='text' onChange={(e:  React.ChangeEvent<HTMLInputElement>) => handleSlippageTolerance(Number(e.target.value))}/> %
        </StyleSettingValueInputContainer>
      </StyleSettingValueContainer>
      <StyleSettingValueInputButton disabled={slippageTolerance === 0} onClick={() => handleSaveSlippageTolerance()}>
        <StyleSettingValueInputButtonText>
          Save
        </StyleSettingValueInputButtonText>
      </StyleSettingValueInputButton>
    </StyledSettingMenu>
  );
};
