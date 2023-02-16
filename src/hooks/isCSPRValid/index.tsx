import { useState } from 'react';
import { NotificationType } from '../../constant';
import { notificationStore } from '../../store/store';

const isCSPRValid = () => {
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const { updateNotification, dismissNotification } = notificationStore();

  const showNotification = () =>
    updateNotification({
      type: NotificationType.Error,
      title: 'Insufficent Gas Reserved',
      subtitle: '',
      show: true,
      chargerBar: false,
    });

  const handleValidate = (currentValue: number, balance: number, gasFee: number) => {
    if ((Number(currentValue) + Number(gasFee)) > balance) {
      setDisableButton(true);
      showNotification()
    } else {
      setDisableButton(false);
      dismissNotification();
    }
  };

  return { disableButton, handleValidate, showNotification };
};

export default isCSPRValid;
