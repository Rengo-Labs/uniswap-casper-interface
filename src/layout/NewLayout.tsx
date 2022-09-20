import React from 'react'
import styled from 'styled-components'

const LayoutStyled = styled.div`
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template: 1fr / 15% auto;
`

const NewNavigation = styled.nav`
    background-color:red;
`
const NewLayout = ({ children }) => {
    return (
        <LayoutStyled>
            <NewNavigation>
                <ol>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                    <li>6</li>
                </ol>
            </NewNavigation>
            <div>{children}</div>
        </LayoutStyled>

    )
}

export default NewLayout