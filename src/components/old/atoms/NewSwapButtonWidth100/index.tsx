import React from 'react'
import { ButtonStyle } from "./styles";

export const NewSwapButtonWidth100 = ({ content, handler, disabled = false }: { content?: any, handler?: any, disabled?: boolean }) => {
    return (
        <ButtonStyle onClick={handler} disabled={disabled}>
            {content}
        </ButtonStyle>
    )
}
