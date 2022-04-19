import React from 'react'
import { SwapToken } from '../SwapToken'
import { TokensStyled } from './styles'
export const SwapTokens = ({ tokens, setToken, handleModal }:any) => {
    return (
        <TokensStyled>
            {
                tokens.map((token:any) => {
                    return <SwapToken key={token} icon={token.icon} token={token} amount={token.amount} setToken={setToken} handleModal={handleModal} />
                })
            }
        </TokensStyled>
    )
}
