import React from 'react'

import { SwapModalStyled, SwapContainerStyled, SwapHeaderStyled, SwapHeaderLineStyled } from './styles'
import { SwapTokens } from '../SwapTokens'
import { AiOutlineClose } from "react-icons/ai";

export const SwapModal = ({ handleModal }) => {

    return (
        <SwapModalStyled>
            <SwapContainerStyled >
                <SwapHeaderLineStyled>
                    <SwapHeaderStyled>
                        <h1>Select Token</h1>
                        <button onClick={()=>{handleModal()}}>
                            <AiOutlineClose />
                        </button>
                    </SwapHeaderStyled>
                </SwapHeaderLineStyled>
                <main>
                    <SwapTokens />
                </main>
            </SwapContainerStyled>
        </SwapModalStyled>
    )
}
