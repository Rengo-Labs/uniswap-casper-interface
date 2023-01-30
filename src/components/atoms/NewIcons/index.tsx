import React, { FunctionComponent, SVGProps } from "react";
import { IconContainerStyle } from "./styles";
import { useTheme } from "styled-components";
import { LightThemeInterface } from "../../../contexts/ThemeContext/themes";

interface IIconStyledProps {
    Icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
    size?: number;
    width?: number;
    height?: number;
    style?: object;
}

const IconStyled = ({ Icon, size, width, height, style = {} }: IIconStyledProps) => {
    const theme = useTheme() as LightThemeInterface;
    const fill = ("fill" in style) && (typeof style.fill === 'string') ? style.fill : theme.PrimaryColor;

    return (
        <IconContainerStyle size={size} style={style} width={width} height={height}>
            <Icon fill={fill} />
        </IconContainerStyle>
    );
};

export const NewIcons = ({ Icon, size, width, height, style = {} }: IIconStyledProps) => (
    <IconStyled Icon={Icon} size={size} width={width} height={height} style={style} />
);
