import { ReactNode } from 'react'
import { SingleColumnContainer } from './styles'

interface SingleColumnProps {
  children: ReactNode
  isMobile: boolean
}
export const SingleColumn = ({ children, isMobile }: SingleColumnProps) => {
  return (
    <SingleColumnContainer isMobile={isMobile}>
      {children}
    </SingleColumnContainer>
  )
}