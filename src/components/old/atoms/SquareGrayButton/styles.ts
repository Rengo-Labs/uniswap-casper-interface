import styled from 'styled-components'
import {device} from "../../../../contexts/ThemeContext/themes";

export const ButtonStyle = styled.div`
  color: ${props => props.theme.NewPurpleColor};
  background-color: #F7FCFE;
  padding: 1rem;
  border: none;
  width: 10rem;
  height: 3rem;
  font-family: 'EpilogueLight';
  font-size: .8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media ${device.mobileS} {
    padding: 0;
  }
  
  @media ${device.mobileM} {
    padding: 2px;
    margin-bottom: 10px;
  }

  @media ${device.mobileL} {
    padding: 0.5rem;
  }

`
