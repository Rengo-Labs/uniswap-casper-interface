import React from 'react'
import { Link } from 'react-router-dom'
import { AnchorStyle } from './styles'
import styled from 'styled-components'

interface AnchorPropInterface {
  isAnchor: boolean,
  to: string,
  insideMessage: string,
}

export const LinkAnchorStyle = styled(Link)`
    color: ${props => props.theme.PrimaryColor};
`

export const Anchor = ({ isAnchor = true, to, insideMessage }: AnchorPropInterface) => {
  if (isAnchor) {
    return <AnchorStyle href={to}> {insideMessage}</AnchorStyle>
  }
  return (
    <LinkAnchorStyle to={to}>
      {insideMessage}
    </LinkAnchorStyle>
  )
}
