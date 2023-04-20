import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

export const WrappedTemplate = styled.div`
    display: flex;
    flex-direction: column;
`

//TODO donde esta el media de uiKit?
export const WrappedMolecule = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    align-self: center;
    
    @media ${device.mobileL} {
        flex-direction: row;
        width: 100%;
    }
`


