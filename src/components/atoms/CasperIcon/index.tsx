import React, { FunctionComponent, SVGProps } from 'react'
import { useTheme } from 'styled-components';
import { LightThemeInterface } from '../../../contexts/ThemeContext/themes';
import { CasperIconContainer } from './styles';

interface IIconStyledProps {
    Icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
    width?: number;
    height?: number;
    style?: object;
}

const IconStyled = ({ Icon, width, height, style = {} }: IIconStyledProps) => {
    const theme = useTheme() as LightThemeInterface;
    const fill = "fill" in style && typeof style.fill === "string" ? style.fill : theme.PrimaryColor;

    return (
        <CasperIconContainer style={style} width={width} height={height}>
            <Icon fill={fill}/>
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
