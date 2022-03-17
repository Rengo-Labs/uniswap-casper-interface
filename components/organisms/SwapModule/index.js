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
        filterCriteriaSet("")
    }
    const handleModalSecondary = () => {
        setActiveModalSecondary(!activeModalSecondary)
        filterCriteriaSet("")
    }
    const { tokens, fileteredTokens,filterCriteriaSet,filterCriteria,primaryToken, secondaryToken, switchTokens, setPrimaryToken, setSecondaryToken } = React.useContext(TokensProviderContext)

    
    return (
        <SwapModulesStyled>
            <SwapSelection onClickHandler={handleModalPrimary} token={primaryToken} />
            {activeModalPrimary ? <SwapModal handleModal={handleModalPrimary} tokens={fileteredTokens} filterCriteria={filterCriteria} filterCriteriaSet={filterCriteriaSet} setToken={setPrimaryToken} /> : ""}
            <SwitchIcon switchHandler={switchTokens} />
            <SwapSelection onClickHandler={handleModalSecondary} token={secondaryToken} />
            {activeModalSecondary ? <SwapModal handleModal={handleModalSecondary} tokens={fileteredTokens} filterCriteria={filterCriteria} filterCriteriaSet={filterCriteriaSet} setToken={setSecondaryToken} /> : ""}
            <SwapButton content="Connect to Wallet"></SwapButton>
        </SwapModulesStyled>
    )
}
