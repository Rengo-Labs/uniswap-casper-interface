import {StyledMenu} from "./styles";
export const NavMenuMobile = ({children, open}) => {
    return (
        <StyledMenu open={open}>
            {children}
        </StyledMenu>
    )
}
