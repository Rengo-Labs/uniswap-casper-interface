import React from 'react'
import { AiOutlineSync } from "react-icons/ai";
import { SwitchButton } from './styles'

export const SwitchIcon = ({ switchHandler, secondTokenSelected, firstTokenSelected,icon="",isIcon=true }: any) => {
    return (
        <SwitchButton onClick={() => { switchHandler() }}>
            {icon}
            {isIcon && <AiOutlineSync size="2rem" />}
        </SwitchButton>
    )
}
