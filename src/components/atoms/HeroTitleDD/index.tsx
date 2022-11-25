import React from 'react'
import styled from 'styled-components'
const HeroTitle = styled.h1`
  font-family: Epilogue;
  font-size: 85.25px;
  padding: 15px 0;
`
export const HeroTitleDD = ({children}) => {
  return (
    <HeroTitle>{children}</HeroTitle>
  )
}
