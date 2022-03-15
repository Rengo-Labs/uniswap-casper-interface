import React from 'react'

import { SwapModalStyled, SwapContainerStyled, SwapHeaderStyled, SwapHeaderLineStyled } from './styles'
import { SwapTokens } from '../SwapTokens'
import { AiOutlineClose } from "react-icons/ai";

export const SwapModal = ({ handleModal,tokens,setToken }) => {

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
                    <SwapTokens tokens={tokens} setToken={setToken} handleModal={handleModal}/>
                </main>
            </SwapContainerStyled>
        </SwapModalStyled>
    )
}
