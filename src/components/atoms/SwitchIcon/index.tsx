import React from 'react'
import { AiOutlineSync } from "react-icons/ai";
import { SwitchButton } from './styles'

export const SwitchIcon = ({ switchHandler, secondTokenSelected, firstTokenSelected }: any) => {
    return (
        <SwitchButton onClick={() => { switchHandler() }}>
            <AiOutlineSync size="2rem" />
        </SwitchButton>
    )
}
