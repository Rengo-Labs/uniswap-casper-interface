import React from 'react'
import styled from 'styled-components'
import BackgroundImage from '../../../assets/hero-image.jpg'

export const Container = styled.main`
    width: 100%;
    min-height: 100vh;
    height: 100%;
    display: grid;
    grid-template: auto 1fr auto/ 1fr;
    background-image: url(${BackgroundImage});
    background-position: initial;
    background-size: cover;
`
export const ContainerDD = ({children}) => {
  return (
    <Container>{children}</Container>
  )
}
