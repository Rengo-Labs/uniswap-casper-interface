import React from 'react'
import { AiOutlineSync } from "react-icons/ai";
import { SwitchButton } from './styles'

export const SwitchIcon = ({ switchHandler,secondTokenSelected,firstTokenSelected }: any) => {
    return (
        <SwitchButton onClick={()=>{switchHandler({ type: 'SWITCH_TOKENS', payload: { secondTokenSelected, firstTokenSelected } })}}>
            <AiOutlineSync size="2rem" />
        </SwitchButton>
    )
}
