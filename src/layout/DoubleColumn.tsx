import { ReactNode } from 'react'
import { DoubleColumnContainer, TitleContainer, Title, Subtitle } from './styles'
import {useTheme} from "styled-components";

export interface DoubleColumnProps {
  children: ReactNode[];
  isMobile: boolean,
  title?: string,
  subTitle?: string
}

export const DoubleColumn = ({ children, isMobile, title, subTitle }: DoubleColumnProps) => {
  const [leftComponent, rightComponent] = children
  const theme = useTheme();

  return (
      <>
        <TitleContainer isMobile={isMobile}>
          {title && <Title isMobile={isMobile} theme={theme}>{title}</Title>}
          {subTitle && <Subtitle isMobile={isMobile} theme={theme}>{subTitle}</Subtitle>}
        </TitleContainer>
        <DoubleColumnContainer isMobile={isMobile}>
          {leftComponent}
          {rightComponent}
        </DoubleColumnContainer>
      </>
  )
}
