import { NotificationsContainerStyles } from './styles'

export const NotificationsContainer = ({ children }) => {
  return (
    <NotificationsContainerStyles>
      {children}
    </NotificationsContainerStyles>
  )
}