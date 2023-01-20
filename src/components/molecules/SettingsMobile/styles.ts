import styled, {keyframes} from 'styled-components';

interface ISettingValueProp {
  customColor?: boolean;
}

const progress = keyframes`
  100% {
    transform: translateY(0);
  }
`;

export const StyledSettingMenu = styled.ul`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 16px 32px 50px;
  gap: 16px;
  background: ${(props) => props.theme.NewWhiteColor};
  border: 1px solid #080808;
  border-radius: 16px 16px 0px 0px;
  width: 100vw;
  height: 300px;
  margin-right: 32px;
  align-self: flex-end;
  position: absolute;
  transform: translateY(100%);
  animation: ${progress} 0.3s linear forwards;
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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

export const Close = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 12px;
  font-family: 'MyriadPro';
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => props.theme.NewPurpleColor};
`;

export const StyleSettingValueContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const StyleSettingValue = styled.div<ISettingValueProp>`
  background-color: ${(props) =>
    props.customColor && props.theme.thirdBackgroundColor};
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  font-size: 18px;
  font-family: "MyriadPro";
  gap: 4px;
  height: 50px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.NewBlackColor};
  color: ${(props) => props.theme.NewPurpleColor};
`;

export const StyleSettingValueInputContainer = styled.div<ISettingValueProp>`
  background-color: ${(props) =>
    props.customColor && props.theme.thirdBackgroundColor};
  display: flex;
  width: 90%;
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
  padding: 12px 32px;
  gap: 4px;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-family: "MyriadPro";
  color: ${(props) => props.theme.NewPurpleColor};
  flex:1;
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
  width: 100%;
  height: 64px;
  border-radius: 8px;
  border: none;
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
