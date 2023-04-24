import { ReactNode } from 'react'
import { DoubleColumnContainer } from './styles'

export interface DoubleColumnProps {
  children: ReactNode[];
  isMobile: boolean
}

export const DoubleColumn = ({ children, isMobile }: DoubleColumnProps) => {
  const [leftComponent, rightComponent] = children

  return (
    <DoubleColumnContainer isMobile={isMobile}>
      {leftComponent}
      {rightComponent}
    </DoubleColumnContainer>
  )
}