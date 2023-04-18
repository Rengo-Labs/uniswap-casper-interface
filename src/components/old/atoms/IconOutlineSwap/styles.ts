import styled from 'styled-components'
import {AiOutlineSwap} from "react-icons/ai";


export const IconOutlineSwapStyle = styled(AiOutlineSwap)`
  align-self: center;
  transform: rotate(90deg);
  color: ${props => props.theme.thirdBackgroundColor};
`;
