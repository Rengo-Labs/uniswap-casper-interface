import {BurgerButtonStyled} from "./styles";

export const BurgerButton = ({open, setOpen}) => {
    return (
        <BurgerButtonStyled open={open} onClick={() => setOpen(!open)} >
            <div/>
            <div/>
            <div/>
        </BurgerButtonStyled>
    )
}
