import {NotificationMessage} from "rengo-ui-kit";
import { notificationStore } from '../../../store/store';

export const NotificationSystem = () => {
  const { notification, updateNotification, dismissNotification } = notificationStore();
  const onDismiss = () => {
    dismissNotification();
  }

  const onClose = () => {
    updateNotification({ ...notification, show: false });
  }
  return (
      <>
        {notification.show && (
            <NotificationMessage
                onClose={onClose}
                isOpen={notification.show}
                title={notification.title}
                subtitle={notification.subtitle}
                type={notification.type}
                isOnlyNotification={notification.isOnlyNotification}
                autoCloseDelay={notification.timeToClose}
            />
        )}
      </>
  );
};
