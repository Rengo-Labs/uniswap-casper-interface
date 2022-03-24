import React from 'react'
import { AiOutlineCaretDown } from "react-icons/ai";


import { TokenButtonStyled } from './styles'

export const TokenButton = ({ handlerFunction }) => {
    return (
        <>
            <TokenButtonStyled onClick={handlerFunction}>
                Select Token <AiOutlineCaretDown />
            </TokenButtonStyled>
        </>
    )
}
