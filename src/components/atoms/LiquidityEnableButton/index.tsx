import React from 'react'
import { IButtonProps } from '../Button'
import { ButtonStyle } from './styles'

export const LiquidityEnableButton = ({ testid = "", content, handler, enabled = true }: IButtonProps & { testid: string}) => {
    return (
        <ButtonStyle data-testid={testid} enabled={enabled} onClick={handler} disabled={!enabled}>
            {content}
        </ButtonStyle>
    );
};
