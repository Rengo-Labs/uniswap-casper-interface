import React from 'react'
import { SwapToken } from '../SwapToken'
import { TokensStyled } from './styles'
export const SwapTokens = ({ tokens, setToken, handleModal }) => {
    return (
        <TokensStyled>
            {
                tokens.map((token, index) => {
                    return <SwapToken key={index} icon={token.icon.src} token={token} amount={token.amount} setToken={setToken} handleModal={handleModal} />
                })
            }
        </TokensStyled>
    )
}
