import styled from 'styled-components'
import { TbTrash } from "react-icons/tb";

export const TrashIconStyled = styled(TbTrash)`
  align-self: center;
  color: ${props => props.theme.thirdBackgroundColor};
  size: 1.3px;
`
