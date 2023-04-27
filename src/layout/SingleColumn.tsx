import { ReactNode } from 'react'
import {SingleColumnContainer, Subtitle, Title, TitleContainer} from './styles'
import {useTheme} from "styled-components";

interface SingleColumnProps {
  children: ReactNode
  isMobile: boolean,
  title?: string,
  subTitle?: string
}
export const SingleColumn = ({ children, isMobile, title, subTitle }: SingleColumnProps) => {
  const theme = useTheme();
  return (
      <>
        <TitleContainer isMobile={isMobile}>
          {title && <Title isMobile={isMobile} theme={theme}>{title}</Title>}
          {subTitle && <Subtitle isMobile={isMobile} theme={theme}>{subTitle}</Subtitle>}
        </TitleContainer>
        <SingleColumnContainer isMobile={isMobile}>
          {children}
        </SingleColumnContainer>
      </>
  )
}
