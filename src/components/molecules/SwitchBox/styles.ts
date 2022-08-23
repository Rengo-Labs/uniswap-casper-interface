import styled, {keyframes} from 'styled-components'
import {ExchangeRateBox} from '../../atoms'

export const ExchangeRateBoxAnimation = styled(ExchangeRateBox)`
    transition: all .2s;
    display: ${props => props.active ? 'initial' : 'none'};
`
interface BoxMovement {
    active: boolean
}

const rotate = keyframes`
  0% {
    margin-left: 40%;
  }
 50% { 
    margin-right:5%; 
 }
 100% { 
    align-self: flex-start;
 }
`;
export const BoxMovementAnimation = styled.div<BoxMovement>`
    display: flex;
    align-self: ${props => props.active ? 'start' : 'center'};
    flex-direction: row;
    animation: ${props => props.active ? rotate : ''} 0.3s linear 1;
`