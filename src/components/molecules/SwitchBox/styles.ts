import styled from 'styled-components'
import {SwitchIcon, ExchangeRateBox} from '../../atoms'

export const SwitchContainerStyled = styled.div`
    display: flex;
    width: 100%;
`

export const SwitchIconAnimation = styled(SwitchIcon)`
    transition: all .5s;
    margin-left: ${props => (props.active ? "0%" : "46%")};
`

export const ExchangeRateBoxAnimation = styled(ExchangeRateBox)`
    transition: all .2s;
    padding-left: 15px;
    visibility: ${props => (props.active ? "initial" : "hidden")};
`