import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { NotificationType } from '../constant';
import { IGlobalStore, INotification, INotificationStore } from './types';

export const globalStore = create(
  devtools<IGlobalStore>((set) => ({
    slippageTolerance: 0.5,
    updateSlippageTolerance: (slippageToleranceValue) =>
      set((state: IGlobalStore) => ({
        ...state,
        slippageTolerance: slippageToleranceValue,
      })),
  }))
);

export const notificationStore = create(
  devtools<INotificationStore>((set) => ({
    notification: {
      title: 'Success',
      subtitle: '',
      type: NotificationType.Success,
      show: false,
      chargerBar: true,
      timeToClose: 20,
      onClose: () => {},
    },
    updateNotification: (notificationValues: INotification) =>
      set((state: INotificationStore) => ({
        ...state,
        notification: { 
          ...state.notification,
          ...notificationValues
        },
      })),
    dismissNotification: () =>
      set((state: INotificationStore) => ({
        ...state,
        notification: {
          ...state.notification,
          show: false,
        },
      })),
  }))
);
