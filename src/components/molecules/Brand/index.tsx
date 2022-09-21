import React, { ReactNode } from 'react'

import { BrandStyles } from './styles'
import { useNavigate } from 'react-router-dom'
export const Brand = ({ children }: { children: ReactNode }) => {
  
  const router = useNavigate()
  const handleClick = (e: any) => {
    e.preventDefault()
    router('/')
  }

  return (
    <BrandStyles onClick={handleClick}>
      {children}
    </BrandStyles>
  )
}
