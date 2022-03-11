import React from 'react'
import { useRouter } from 'next/router'

import { NavegableTemplate } from '../../components/templates/NavegableTemplate'
import { CardContainer } from '../../components/atoms'
import { TokensModule } from '../../components/organisms'

import { usUS } from '../../components/i11n'
const Tokens = () => {
  const router = useRouter()
  const handleClick = (e) => {
    e.preventDefault()
    router.push('/swap')
  }

  const { brandName, brandIMG, mainButton, listOfLinks } = usUS

  return (
    <NavegableTemplate title={brandName} url={brandIMG} content={mainButton} handler={handleClick} listOfLinks={listOfLinks}>
      <CardContainer cardTitle="Tokens" width="68%">
        <TokensModule></TokensModule>
      </CardContainer >
    </NavegableTemplate>
  )
}

export default Tokens
