import styled from "styled-components";

export const WalletSelectionStyled = styled.div<any>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background-color: ${(props) => props.theme.NewGreyColor};
    border-radius: 10px;
    &:hover {
        cursor: pointer;
    }
    &:active {
        background-color: ${(props) => props.theme.NewGreyColor};
    }

    ${(props) =>
        props.isSelected &&
        `
    color: ${props.theme.PrimaryColor};
    background: ${props.theme.NewPurpleColor};
    `}
`;