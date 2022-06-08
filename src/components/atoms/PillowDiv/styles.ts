import styled from "styled-components";

export const PillowStyled = styled.div`
    margin-top:10px;
    padding: .5rem;
    border-radius: 10px;
    background-color: ${props => props.theme.StrongColor2};
    display: flex;
    gap: 10px;
    justify-content: space-evenly;
`