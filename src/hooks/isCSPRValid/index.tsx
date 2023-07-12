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

    const isInvalidTransaction = (currentValue: number, gasFee: number, balance: number,  tokenSymbol, aplicationToken) => {
      console.log(currentValue, balance, tokenSymbol, aplicationToken)
      if (tokenSymbol === aplicationToken) {
        return (Number(currentValue) + Number(gasFee)) > balance
      } else {
        if (Number(currentValue) > balance) {
         return true
        } 

        return gasFee > Number(tokenState.tokens[aplicationToken].amount) && Number(currentValue) > 0
      }
    }


  const cleanValidationState = (
    currentValue: number,
    balance: number,
    gasFee: number,
    tokenSymbol = firstTokenSelected.symbol) => {
      const applicationToken = 'CSPR'
      const showNotifier = isInvalidTransaction(currentValue, gasFee, balance, tokenSymbol, applicationToken)

      console.log(currentValue, balance, tokenSymbol, applicationToken)
      if (!showNotifier) {
        setDisableButton(showNotifier)
      }
  }

  const handleValidate = (
    currentValue: number,
    balance: number,
    gasFee: number,
    tokenSymbol = firstTokenSelected.symbol
  ) => {
    const applicationToken = 'CSPR'
    const showNotifier = isInvalidTransaction(currentValue, gasFee, balance, tokenSymbol, applicationToken)
    if (showNotifier) {
      showNotification(`Insufficient Balance for the token : ${tokenSymbol}`)
    } else {
      dismissNotification()
    }

    setDisableButton(showNotifier)
    return showNotifier
  };

  return {
    disableButton,
    setDisableButton,
    handleValidate,
    showNotification,
    dismissNotification,
    cleanValidationState
  };
};

export default isCSPRValid;
