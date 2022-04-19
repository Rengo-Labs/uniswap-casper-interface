import React from 'react'
import { Link } from 'react-router-dom'
import { AnchorStyle } from './styles'

interface AnchorPropInterface {
  isAnchor: boolean,
  to: string,
  insideMessage: string
}

export const Anchor = ({ isAnchor = true, to, insideMessage }: AnchorPropInterface) => {
  if (isAnchor) {
    return <AnchorStyle href={to}> {insideMessage}</AnchorStyle>
  }
  return (
    <Link to={to}>
      <AnchorStyle>{insideMessage}</AnchorStyle>
    </Link>
  )
}
