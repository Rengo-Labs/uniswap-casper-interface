import { NotificationItem } from '../../atoms/NotificationItem';
import { NotificationsContainer } from '../../atoms/NotificationsContainer';

export interface INotification {
  id: string;
  message: string;
  isRead: boolean;
}

export interface NotificationListProps {
  notifications: INotification[];
  updateNotificationReadState: (id: string) => void;
}

export const NotificationList = ({ notifications, updateNotificationReadState }: NotificationListProps) => {
  return (
    <NotificationsContainer>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          isRead={notification.isRead}
          message={notification.message}
          onClick={() => updateNotificationReadState(notification.id)}
        />
      ))}
    </NotificationsContainer>
  );
};
