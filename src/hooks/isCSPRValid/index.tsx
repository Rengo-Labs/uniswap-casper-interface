import { useState } from 'react';
import { NotificationType } from '../../constant';
import { notificationStore } from '../../store/store';

const isCSPRValid = (gasFee: number,) => {
  const [disableButtom, setDisableButtom] = useState<boolean>(false);
  const { updateNotification, dismissNotification } = notificationStore();

  const handleValidate = (currentValue: number,  balance: number) => {
    console.log('currentValue', currentValue);
    console.log('gasFee', gasFee);
    console.log('balance', balance);
    if (currentValue + gasFee > balance) {
      setDisableButtom(true);
      updateNotification({
        type: NotificationType.Error,
        title: 'Insufficent Gas Reserved',
        subtitle: '',
        show: true,
        chargerBar: true,
      });
    } else {
      setDisableButtom(false);
      dismissNotification();
    }
  };

  return { disableButtom, handleValidate };
};

export default isCSPRValid;
