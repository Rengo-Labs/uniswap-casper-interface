import styled, {keyframes} from 'styled-components';

interface ISettingValueProp {
  customColor?: boolean;
}

const progress = keyframes`
  100% {
    transform: translateX(0);
  }
`;

export const StyledSettingMenu = styled.ul`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 16px;
  gap: 16px;
  background: #f7fcfe;
  border: 1px solid #080808;
  border-bottom: none;
  border-radius: 16px 16px 0px 0px;
  width: 100%;
  height: 286px;
  margin-right: auto;
  margin-bottom: 55px;
  position: absolute;
  transform: translateX(-100%);
  animation: ${progress} 0.3s linear forwards;
`;

export const StyleTitle = styled.h5`
  font-family: 'MyriadPro';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.02em;
  color: ${(props) => props.theme.NewPurpleColor};
`;

export const StyleSettingValueContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

export const StyleSettingValue = styled.div<ISettingValueProp>`
  background-color: ${(props) =>
    props.customColor && props.theme.thirdBackgroundColor};
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px;
  gap: 4px;
  width: 70px;
  height: 50px;
  border: 1px solid #080808;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.NewBlackColor};
  color: ${(props) => props.theme.NewPurpleColor};
`;

export const StyleSettingValueInputContainer = styled.div<ISettingValueProp>`
  background-color: ${(props) =>
    props.customColor && props.theme.thirdBackgroundColor};
  display: flex;
  width: 210px;
  height: 50px;
  flex-direction: row;
  align-items: center;
  border: 1px solid #080808;
  border-radius: 12px;
  padding-right: 2rem;
`;

export const StyleSettingValueInput = styled.input`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 32px;
  gap: 4px;
  border: none;
  border-radius: 12px;
  color: ${(props) => props.theme.NewPurpleColor};
  &:focus {
    outline: none;
  }
`;

export const StyleSettingValueInputButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 25px;
  gap: 4px;
  width: 240px;
  height: 64px;
  border-radius: 8px;
  background: ${(props) =>
    props.disabled
      ? props.theme.NewGreyColor
      : props.theme.thirdBackgroundColor};
`;

export const StyleSettingValueInputButtonText = styled.h4`
  font-family: 'MyriadPro';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  letter-spacing: 0.02em;
  color: ${(props) => props.theme.NewPurpleColor};
`;

export const Text = styled.h4`
  color: ${(props) => props.theme.NewPurpleColor};
  font-size: 16px;
  font-family: 'MyriadPro';
`;
