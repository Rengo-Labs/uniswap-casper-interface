import React from 'react'

import { SwapModalStyled, SwapContainerStyled, SwapHeaderStyled, SwapHeaderLineStyled } from './styles'
import { SwapToken } from '../SwapToken'
import { AiOutlineClose } from "react-icons/ai";

export const SwapModal = ({ handleModal }) => {
    const token = {
        icon: "",
        token: {
            name: "",
            acron: ""
        },
        amount: 0.0000
    }
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
                    <SwapToken icon={""} token={""} amount={""} />
                </main>
            </SwapContainerStyled>
        </SwapModalStyled>
    )
}
