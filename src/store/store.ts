import create from 'zustand';
import {devtools} from 'zustand/middleware';
import {NotificationType, NODE_ADDRESS} from '../constant';
import {IGlobalStore, INotification, INotificationStore, IStakeNotification, IStakeNotificationStore} from './types';

export const globalStore = create(
    devtools<IGlobalStore>((set) => ({
        slippageTolerance: 0.5,
        nodeUrl: NODE_ADDRESS,
        updateSlippageTolerance: (slippageToleranceValue) =>
            set((state: IGlobalStore) => ({
                ...state,
                slippageTolerance: slippageToleranceValue,
            })),
        updateNodeUrl: (nodeUrlValue) =>
            set((state: IGlobalStore) => ({
                ...state,
                nodeUrl: nodeUrlValue,
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
          isOnlyNotification: true,
          timeToClose: 5000,
          closeManually: false,
        },
        updateNotification: (notificationValues: INotification) =>{
          set(() => ({
            notification: structuredClone(notificationValues)
          }))
        },
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

export const stakeNotificationStore = create(
    devtools<IStakeNotificationStore>((set) => ({
        stakeNotification: {
            show: false,
            data: {
                amount: '0.00',
                symbol: '',
                tokenName: '',
                tokenImage: '',
            },
        },
        updateStakeNotification: (notificationValues: IStakeNotification) =>{
            set(() => ({
                stakeNotification: structuredClone(notificationValues)
            }))
        },
        dismissStakeNotification: () =>
            set((state: IStakeNotificationStore) => ({
                ...state,
                notification: {
                    ...state.stakeNotification,
                    show: false,
                },
            })),
    }))
);
