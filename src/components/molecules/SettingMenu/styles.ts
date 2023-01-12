import styled from 'styled-components';

interface ISettingValueProp {
  customColor?: boolean;
}

export const StyledSettingMenu = styled.ul`
  position: absolute;
  background-color: white;
  box-sizing: border-box;
  justify-self: center;
  height: 227px;
  width: 499px;
  border: 1px solid ${(props) => props.theme.NewBlackColor};
  border-radius: 10px;
  z-index: 50;
  margin-left: 790px;
  margin-top: -185px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 16px 32px 32px;
  gap: 16px;
`;

export const StyleTitle = styled.h5`
  font-family: 'MyriadPro';
  font-style: normal;
  font-weight: 400;
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
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 32px;
  gap: 4px;
  border: 1px solid ${(props) => props.theme.NewBlackColor};
  border-radius: 12px;
  color: ${(props) => props.theme.NewPurpleColor};
`;

export const StyleSettingValueInputContainer = styled.div<ISettingValueProp>`
  background-color: ${(props) =>
    props.customColor && props.theme.thirdBackgroundColor};
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #080808;
  border-radius: 12px;
  padding-right: 2rem;
`;

export const StyleSettingValueInput = styled.input`
  border: none;
  width: 100%;
  padding: 16px;
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
  width: 435px;
  height: 64px;
  background: ${(props) => props.disabled ? props.theme.NewGreyColor: props.theme.thirdBackgroundColor};
  border-radius: 8px;
  cursor: pointer;
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
`
