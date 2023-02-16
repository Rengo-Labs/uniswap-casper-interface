import { useState } from 'react';
import { NotificationType } from '../../constant';
import { notificationStore } from '../../store/store';

const isCSPRValid = () => {
  const [disableButtom, setDisableButtom] = useState<boolean>(false);
  const { updateNotification, dismissNotification } = notificationStore();

  const showNotification = () =>
    updateNotification({
      type: NotificationType.Error,
      title: 'Insufficent Gas Reserved',
      subtitle: '',
      show: true,
      chargerBar: true,
    });


  const handleValidate = (currentValue: number, balance: number, gasFee: number) => {
    if ((Number(currentValue) + Number(gasFee)) > balance) {
      setDisableButtom(true);
      showNotification()
    } else {
      setDisableButtom(false);
      dismissNotification();
    }
  };

  return { disableButtom, setDisableButtom, handleValidate, showNotification, dismissNotification };
};

export default isCSPRValid;
