import { useContext, useState } from 'react';
import { NotificationType } from '../../constant';
import { TokensProviderContext } from '../../contexts/TokensContext';
import { notificationStore } from '../../store/store';

const isCSPRValid = () => {
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const { updateNotification, dismissNotification } = notificationStore();
  const {firstTokenSelected, tokenState} = useContext(TokensProviderContext)

  const showNotification = (title = 'Insufficient Gas Reserved') =>
    updateNotification({
      type: NotificationType.Error,
      title,
      subtitle: '',
      show: true,
      isOnlyNotification: true,
      timeToClose: 5000,
    });

  const handleValidate = (
    currentValue: number,
    balance: number,
    gasFee: number,
    tokenSymbol = firstTokenSelected.symbol
  ) => {
    const aplicationToken = 'CSPR'
    if (tokenSymbol === aplicationToken) {
      if (Number(currentValue) + Number(gasFee) > balance) {
        setDisableButton(true);
        showNotification();
      } else {
        setDisableButton(false);
        dismissNotification();
      }
    } else {
      if (Number(currentValue) > balance) {
        setDisableButton(true);
        showNotification(`Insufficient Balance for the token : ${tokenSymbol}`);
      } else if (gasFee > Number(tokenState.tokens[aplicationToken].amount) && Number(currentValue) > 0) {
        setDisableButton(true);
        showNotification();
      } else {
        setDisableButton(false);
        dismissNotification();
      }
    }
  };

  return {
    disableButton,
    setDisableButton,
    handleValidate,
    showNotification,
    dismissNotification,
  };
};

export default isCSPRValid;
