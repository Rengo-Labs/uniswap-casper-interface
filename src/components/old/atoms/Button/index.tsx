import React, { ReactNode } from 'react'
import { ButtonStyle } from './styles'

export interface IButtonProps {
    content: ReactNode;
    handler: () => void;
    style?: object;
    enabled?: boolean;
} 

export const Button = ({ content, handler, style = {}, enabled = true }: IButtonProps) => {
    return (
        <ButtonStyle enabled={enabled} style={style} onClick={handler} disabled={!enabled}>
            {content}
        </ButtonStyle>
    );
};
