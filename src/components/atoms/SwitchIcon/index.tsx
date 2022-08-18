import React from 'react'
import { TbArrowsDownUp } from "react-icons/tb";
import { SwitchButton } from './styles'

export const SwitchIcon = ({ switchHandler, secondTokenSelected, firstTokenSelected,icon="",isIcon=true, className }: any) => {
    return (
        <SwitchButton onClick={() => { switchHandler() }} className={className}>
            {icon}
            {isIcon && <TbArrowsDownUp size="1.5rem" />}
        </SwitchButton>
    )
}
