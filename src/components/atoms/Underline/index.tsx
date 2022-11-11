import React from 'react'
import styled from 'styled-components'

const UnderlineStyled = styled.div`
    box-sizing: border-box;
    position: relative;
    left:calc(-2rem + -3px);
    width: 29rem;
    border-bottom: 1px solid black;
`
const Underline = () => {
  return (
    <UnderlineStyled></UnderlineStyled>
  )
}

export default Underline