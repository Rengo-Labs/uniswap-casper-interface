import { NotificationType } from '../constant';

export interface IGlobalStore {
  slippageTolerance: number;
  updateSlippageTolerance: (slippageToleranceValue:  number ) => void;
  nodeUrl: string;
  updateNodeUrl: (nodeUrlValue: string) => void;
}

export interface INotification {
  title: string;
  subtitle?: string;
  type: NotificationType;
  show: boolean;
  isOnlyNotification?: boolean;
  timeToClose?: number;
  closeManually?: boolean
  onClose?: () => void;
}

export interface IStakeNotification {
    show: boolean;
    data: {
        amount: string;
        symbol: string;
        tokenName: string;
        tokenImage: string;
    };
}

export interface INotificationStore {
  notification: INotification
  updateNotification: (notification: INotification) => void;
  dismissNotification: () => void;
}

export interface IStakeNotificationStore {
    stakeNotification: IStakeNotification
    updateStakeNotification: (notification: IStakeNotification) => void;
    dismissStakeNotification: () => void;
}
