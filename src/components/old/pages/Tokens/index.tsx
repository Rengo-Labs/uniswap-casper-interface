import React from 'react'
import { CardContainer } from '../../atoms'
import { TokensModule } from '../../organisms'
import NewLayout from '../../../../layout/NewLayout'

export const Tokens = () => {

  return (
    <NewLayout>
      <CardContainer cardTitle="Tokens" width="68%">
        <TokensModule></TokensModule>
      </CardContainer >
    </NewLayout>
  )
}
