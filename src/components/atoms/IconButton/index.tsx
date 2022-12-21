import { IconButtonStyles } from './styles'

export const IconButton = ({ children, onClick, disabled, ...props }) => {
  return (
    <IconButtonStyles onClick={onClick} {...props}>
      {children}
    </IconButtonStyles>
  )
}