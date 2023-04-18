import { Item } from './styles';

export const NotificationItem = ({ message, isRead, onClick }) => (
  <Item isRead={isRead} onClick={onClick}>
    {message}
  </Item>
);
