import styled from 'styled-components'

interface Props {
    isRead: boolean
}

export const Item = styled.li<Props>`
    color: ${props => props.isRead ? props.theme.NewGrayColor : 'red'};
    font-size: .8vw;
    font-weight: 600;
    cursor: pointer;
    margin: 0 0 0 1rem;
    font-family: 'EpilogueLight';
    &:hover {
        color: ${props => props.theme.NewPurpleColor};
    }
`