import { StyledMenuItem } from './styles'

export const MenuItem = ({ icon, text, onClickHandler }: { icon?: any, text: string, onClickHandler: any }) => {
  return (
    <StyledMenuItem onClick={onClickHandler}>
      {text}
    </StyledMenuItem>
  )
}