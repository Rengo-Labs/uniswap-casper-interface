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

export interface INotificationStore {
  notification: INotification
  updateNotification: (notification: INotification) => void;
  dismissNotification: () => void;
}
