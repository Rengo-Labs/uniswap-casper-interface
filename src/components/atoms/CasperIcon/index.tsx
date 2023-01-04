import React from 'react'
import { CasperIconContainer } from './styles';

interface IIconStyledProps {
    Icon: any;
    width?: number;
    height?: number;
    style?: any;
}

const IconStyled = ({ Icon, width, height, style = {} }: IIconStyledProps) => {
    return (
        <CasperIconContainer style={style} width={width} height={height}>
            <Icon/>
        </CasperIconContainer>
    );
};

export const CasperIcons = ({ Icon, width, height, style = {} }: IIconStyledProps) => (
    <IconStyled
        Icon={Icon}
        width={width}
        height={height}
        style={style}
    />
);
