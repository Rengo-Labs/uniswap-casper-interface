import React from 'react'
import { SwapToken } from '../SwapToken'

export const SwapTokens = ({ tokens, setToken,handleModal }) => {
    return (
        <div>
            {
                tokens.map((token, index) => {
                    return <SwapToken key={index} icon={token.icon.src} token={token} amount={token.amount} setToken={setToken} handleModal={handleModal} />
                })
            }
        </div>
    )
}
