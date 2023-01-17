import styled from 'styled-components';
import {device} from "../../../contexts/ThemeContext/themes";

export const Main = styled.main`
  box-sizing: border-box;
  justify-self: center;
  width: 100%;
  color: black;
  display: grid;
  grid-template-columns: auto auto;
  padding: 10px;
  z-index: 0;
`

export const Wrapper = styled.section`
  justify-self: end;
  box-sizing: border-box;
  width: 463px;
  border: 1px solid black;
  border-radius: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 20px 25px;
  z-index: 2;

  @media ${device.mobileS} {
    width: 100%;
    padding: 0;
    border: none;
  }
  
  @media ${device.tablet} {
    width: 462px;
    padding: 20px 25px;
    border: 1px solid black;
  }

  & > *:not(:last-child){
    margin-bottom: 1rem;
  }
`
