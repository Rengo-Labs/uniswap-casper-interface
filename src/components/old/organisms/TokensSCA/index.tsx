import React from 'react'
import { ContainerTokenSCA, LinerTokenSCA, InnerTokenSCA } from '../../atoms'

export const TokensSCA = ({ Token, amoutSwapToken }) => {
  return (
    <ContainerTokenSCA>
        <LinerTokenSCA>
            <InnerTokenSCA>
                <img src={Token.logoURI} width="50" height="50" />
                <p>{amoutSwapToken}</p>
            </InnerTokenSCA>

            <p>{Token.name} </p>

        </LinerTokenSCA>

    </ContainerTokenSCA>
)
}
