import {NotificationMessage, StakeMessage} from "rengo-ui-kit";
import { notificationStore, stakeNotificationStore } from '../../../store/store';
import { NotificationType } from "../../../constant";

const defaultState = {
  title: 'Success',
  subtitle: '',
  type: NotificationType.Success,
  show: false,
  isOnlyNotification: false,
  closeManually: false,
}

const defaultStakeState = {
  show: false,
  data: {
    amount: '0.00',
    symbol: '',
    tokenName: '',
    tokenImage: '',
  }
}

export const NotificationSystem = () => {
  const { notification, updateNotification, dismissNotification } = notificationStore();
  const { stakeNotification, updateStakeNotification } = stakeNotificationStore();

  const onDismiss = () => {
    dismissNotification();
  }

  const onClose = () => {
    updateNotification({ ...defaultState, show: false });
  }

  const onCloseStake = () => {
    updateStakeNotification({ ...defaultStakeState, show: false });
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
        {stakeNotification.show && (
            <StakeMessage
                isOpen={stakeNotification.show}
                tokenImg={stakeNotification.data.tokenImage}
                tokenName={stakeNotification.data.tokenName}
                amount={stakeNotification.data.amount}
                closeCallback={onCloseStake}
            />
        )}
      </>
  );
};
