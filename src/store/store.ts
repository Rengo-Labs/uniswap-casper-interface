import create from 'zustand';
import {devtools} from 'zustand/middleware';
import {NotificationType, NODE_ADDRESS} from '../constant';
import {IGlobalStore, INotification, INotificationStore} from './types';

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
            onClose: () => {
            },
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
