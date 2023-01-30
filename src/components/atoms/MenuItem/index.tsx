import { FunctionComponent, SVGProps } from "react";
import { useTheme } from "styled-components";
import { LightThemeInterface } from "../../../contexts/ThemeContext/themes";
import { NewIcons } from "../NewIcons";
import { StyledIconContainer, StyledMenuItem, Text } from "./styles";

export interface IMenuItemProps {
    icon?: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
    text: string;
    onClickHandler: () => void;
}

export const MenuItem = ({ icon, text, onClickHandler }: IMenuItemProps) => {
    const theme = useTheme() as LightThemeInterface;
    return (
        <StyledMenuItem onClick={onClickHandler}>
            <StyledIconContainer>
                <a href="#" style={{ display: "grid", placeItems: "center" }}>
                    <NewIcons Icon={icon} size={20} style={{ fill: theme.NewPurpleColor }} />
                </a>
                <Text>{text}</Text>
            </StyledIconContainer>
        </StyledMenuItem>
    );
};
