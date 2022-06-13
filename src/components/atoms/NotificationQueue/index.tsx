import React from 'react'
import styled from 'styled-components'

const NotificationStyled = styled.div`
    border-radius: 10px;
    position: absolute;
    top: 10%;
    right: 8rem;
    background-color:blue;
    z-index: 3;
    height: 10vh;
    width: 25vw;
    display: flex;
    flex-direction: column;
`
const MessageStyled = styled.div`
    border-radius: 10px;
    width: 100%;
    height: 100%;
    background-color:green;
    padding:10px;
`



export const NotificationQueue = () => {
    return (
        <NotificationStyled>
            <MessageStyled>Message</MessageStyled>
        </NotificationStyled>
    )
}
