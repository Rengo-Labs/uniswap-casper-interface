import React from 'react'

import { SwapModalStyled, SwapContainerStyled, SwapHeaderStyled, CloseButtonStyled } from './styles'
import { SwapTokens } from '../SwapTokens'
import { AiOutlineClose } from "react-icons/ai";

export const SwapModal = ({ handleModal, tokens, setToken }) => {

    return (
        <SwapModalStyled>
            <SwapContainerStyled >
                <SwapHeaderStyled>
                    <h1>Select Token</h1>
                    <CloseButtonStyled onClick={() => { handleModal() }}>
                        <AiOutlineClose />
                    </CloseButtonStyled>
                </SwapHeaderStyled>
                <SwapTokens tokens={tokens} setToken={setToken} handleModal={handleModal} />
            </SwapContainerStyled>
        </SwapModalStyled>
    )
}
