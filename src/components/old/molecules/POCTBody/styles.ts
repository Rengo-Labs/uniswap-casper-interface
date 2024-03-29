import styled from 'styled-components'
import {AiFillStar, AiOutlineStar, AiOutlineSwap} from "react-icons/ai";
import {TbTrash} from "react-icons/tb";
import {device} from "../../../../contexts/ThemeContext/themes";

export const TBody = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    color: black;
    font-family: 'MyriadPro';
    gap: 8px;
    
    @media ${device.laptop} {
        overflow-y: scroll;
        height: 32.5rem;
    }
`

export const CircleButton = styled.button`
    background-color: ${props => props.disabled ? "grey" : props.theme.secondBackgroundColor};
    display: flex;
    padding: 0;
    border: 0;
    cursor: ${props => props.disabled ? "auto" : "pointer"};
    justify-content: center;
    border-radius: 50%;
    margin: 5px;
    height: 4.5vh;
    width: 4.5vh;
`

export const CircleSwapIcon = styled(AiOutlineSwap)`
    align-self: center;
    transform: rotate(90deg); 
    color: ${props => props.theme.thirdBackgroundColor};
`

export const CircleTrashIcon = styled(TbTrash)`
    align-self: center;
    color: ${props => props.theme.thirdBackgroundColor};
`

export const CircleStarIcon = styled(AiFillStar)`
    cursor: pointer;
    font-size: 22px;
    color: ${props => props.theme.secondBackgroundColor};
`

export const CircleStarDisabledIcon = styled(AiOutlineStar)`
    cursor: pointer;
    font-size: 22px;
    color: ${props => props.theme.secondBackgroundColor};
`
