import React from 'react'
import { SwapButton, SwitchIcon } from '../../atoms'
import { SwapInput } from '../../molecules/SwapInput'
import { SwapSelection } from '../../molecules/SwapSelection'
import { SwapModal } from '../../molecules/SwapModal'
import { TokenReadySwap } from '../../molecules/TokenReadySwap'
import { SwapModulesStyled } from './styles'
import { TokensProviderContext } from '../../../contexts/TokensContext'
export const SwapModule = ({ tokenOne }) => {

    const [activeModalPrimary, setActiveModalPrimary] = React.useState(false)
    const [activeModalSecondary, setActiveModalSecondary] = React.useState(false)

    const handleModalPrimary = () => {
        setActiveModalPrimary(!activeModalPrimary)
    }
    const handleModalSecondary = () => {
        setActiveModalSecondary(!activeModalSecondary)
    }
    const { tokens, primaryToken, secondaryToken, switchTokens, setPrimaryToken, setSecondaryToken } = React.useContext(TokensProviderContext)

    return (
        <SwapModulesStyled>
            <SwapSelection onClickHandler={handleModalPrimary} token={primaryToken} />
            {activeModalPrimary ? <SwapModal handleModal={handleModalPrimary} tokens={tokens} setToken={setPrimaryToken} /> : ""}
            <SwitchIcon switchHandler={switchTokens} />
            <SwapSelection onClickHandler={handleModalSecondary} token={secondaryToken} />
            {activeModalSecondary ? <SwapModal handleModal={handleModalSecondary} tokens={tokens} setToken={setSecondaryToken} /> : ""}
            <SwapButton content="Connect to Wallet"></SwapButton>
        </SwapModulesStyled>
    )
}
