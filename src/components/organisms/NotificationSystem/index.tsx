import {NotificationMessage} from "rengo-ui-kit";
import { notificationStore } from '../../../store/store';
import { NotificationType } from "../../../constant";

const defaultState = {
  title: 'Success',
  subtitle: '',
  type: NotificationType.Success,
  show: false,
  isOnlyNotification: false,
  closeManually: false,
}

export const NotificationSystem = () => {
  const { notification, updateNotification, dismissNotification } = notificationStore();
  const onDismiss = () => {
    dismissNotification();
  }

  const onClose = () => {
    updateNotification({ ...defaultState, show: false });
  }
  return (
      <>
        {notification.show && (
            <NotificationMessage
                key={notification.type}
                onClose={onClose}
                isOpen={notification.show}
                title={notification.title}
                subtitle={notification.subtitle}
                type={notification.type}
                isOnlyNotification={notification.isOnlyNotification}
                autoCloseDelay={notification.timeToClose}
                closeManually={notification.closeManually}
            />
        )}
      </>
  );
};
