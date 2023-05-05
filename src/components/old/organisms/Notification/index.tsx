import { NotificationType } from '../../../../constant';
import { notificationStore } from '../../../../store/store';
import { Notification } from '../../molecules';

export const NotificationSystem = () => {
  const { notification, updateNotification } = notificationStore();

  const onClose = () => {
    updateNotification({ ...notification, show: false });
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      {notification.show && (
        <Notification
          title={notification.title}
          subtitle={notification.subtitle}
          type={notification.type}
          onClose={onClose}
          //chargerBar={notification.chargerBar}
          timeToClose={notification.timeToClose}
        />
      )}
    </div>
  );
};
