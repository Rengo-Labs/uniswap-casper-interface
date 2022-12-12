import styled from 'styled-components';

interface ISettingValueProp {
  customColor?: boolean;
}

export const StyledSettingMenu = styled.ul`
  position: absolute;
  background-color: white;
  box-sizing: border-box;
  justify-self: center;
  height: 100px;
  width: 450px;
  padding: 1rem 2rem;
  border: 1px solid ${(props) => props.theme.NewGreyColor};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;
  z-index: 50;
  margin-left: 735px;
  margin-top: -50px;
`;

export const StyleTitle = styled.h5`
  font-size: 1rem;
  font-family: 'EpilogueLight';
  font-weight: 600;
`;

export const StyleSettingValueContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 60px;
`;

export const StyleSettingValue = styled.div<ISettingValueProp>`
  background-color: ${(props) => props.customColor && props.theme.thirdBackgroundColor};
  box-sizing: border-box;
  justify-self: center;
  padding: .5rem;
  border: 1px solid ${(props) => props.theme.NewGreyColor};
  border-radius: 10px;
  display: flex;
  justify-content: center;
`;
