import React from 'react'
import { AiOutlineSwap } from "react-icons/ai";
import { SwitchButton } from './styles'

export const SwitchIcon = ({ switchHandler, icon="",isIcon=true, className }: any) => {
    return (
        <SwitchButton data-testid="switch_button" onClick={switchHandler} className={className}>
            {icon}
            {/* TODO: remove inline css*/}
            {isIcon && <AiOutlineSwap style={{transform: "rotate(90deg)"}} size="1.5rem" />}
        </SwitchButton>
    )
}
