import React from 'react'

import { CardContainer } from '../../atoms'
import { TokensModule } from '../../organisms'

import { BasicLayout } from '../../../layout/Basic'

const Tokens = () => {

  return (
    <BasicLayout>
      <CardContainer cardTitle="Tokens" width="68%">
        <TokensModule></TokensModule>
      </CardContainer >
    </BasicLayout>
  )
}

export default Tokens
