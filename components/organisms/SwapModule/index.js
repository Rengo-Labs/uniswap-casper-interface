import React from 'react'
import { SwapButton, SwitchIcon } from '../../atoms'
import { SwapInput } from '../../molecules/SwapInput'
import { SwapSelection } from '../../molecules/SwapSelection'
import { SwapModal } from '../../molecules/SwapModal'
import { TokenReadySwap } from '../../molecules/TokenReadySwap'
import { SwapModulesStyled } from './styles'
import { TokensProviderContext } from '../../../contexts/TokensContext'
export const SwapModule = ({ tokenOne }) => {
    const [activeModal, setActiveModal] = React.useState(false)
    const [activeTokenOne, setActiveTokenOne] = React.useState(tokenOne)
    const handleModal = () => {
        setActiveModal(!activeModal)
    }
    const tokens = React.useContext(TokensProviderContext)
    return (
        <SwapModulesStyled>
            {tokenOne !== '' ? <SwapSelection onClickHandler={handleModal} token={tokens[0]} /> : <TokenReadySwap />}
            {activeModal ? <SwapModal handleModal={handleModal} /> : "show"}
            <SwitchIcon />
            <SwapInput />
            <SwapButton content="Connect to Wallet"></SwapButton>
        </SwapModulesStyled>
    )
}
