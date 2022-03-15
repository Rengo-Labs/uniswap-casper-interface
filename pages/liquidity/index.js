import React from 'react'
import { useRouter } from 'next/router'

import { NavegableTemplate } from '../../components/templates/NavegableTemplate'
import { CardContainer } from '../../components/atoms'
import { SwapModule,LiquidityModule } from '../../components/molecules'

import { usUS } from '../../components/i11n'
const Liquidity = () => {
  const router = useRouter()
  const handleClick = (e) => {
    e.preventDefault()
    router.push('/swap')
  }

  const { brandName, brandIMG, mainButton, listOfLinks } = usUS

  return (
    <NavegableTemplate title={brandName} url={brandIMG} content={mainButton} handler={handleClick} listOfLinks={listOfLinks}>
      <CardContainer cardTitle="Add Liquidity">
        <SwapModule />
      </CardContainer >
      <CardContainer cardTitle="Your Liquidity">
        <LiquidityModule />
      </CardContainer >
    </NavegableTemplate>
  )
}

export default Liquidity
