import React from 'react'

import { Button, Anchor } from '../../atoms'

import { ActionsStyles } from './styles'

export const ActionsBar = ({ isAnchor, to, content, insideMessage, handler }) => {
  return (
    <ActionsStyles>
      <Anchor isAnchor={isAnchor} to={to} insideMessage={insideMessage} />
      <Button content={content} handler={handler} />
    </ActionsStyles>
  )
}
