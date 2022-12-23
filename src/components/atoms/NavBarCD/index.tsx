import { isConnected } from 'casper-js-sdk/dist/lib/Signer';
import React from 'react';
import { ButtonConnectionOver } from '../../organisms';
import { ConnectButtonContainerCC } from '../ConnectButtonContainerCC';
import { NavBarCC } from '../NavBarCC';
import { WordMarkContainerStyledCC } from '../WordMarkContainerStyledCC';
import { ReactComponent as NotificationR } from '../../../assets/newIcons/notificationActive.svg';
import { ReactComponent as Notification } from '../../../assets/newIcons/notificationDesactive.svg';
import { NewIcons } from '../NewIcons';
import { GroupIconButtons } from '../../molecules/GroupIconsButtons';
import { NotificationList } from '../../molecules/NotificationList';
import { INotification } from '../../molecules/NotificationList';
import { IconButton } from '../IconButton';

export interface NavBarCDProps {
  isConnected: boolean;
  onConnect: (name: string) => void;
  onDisconnect: () => void;
  accountHashString: string;
  WordMarkIcon: React.ReactElement;
  notifications: INotification[];
  showNotifications: boolean;
  setShowNotifications: (value: boolean) => void;
  updateNotificationReadState: (id: string) => void;
}

export const NavBarCD = ({
  isConnected,
  onConnect,
  onDisconnect,
  accountHashString,
  WordMarkIcon,
  notifications,
  showNotifications,
  setShowNotifications,
  updateNotificationReadState
}: NavBarCDProps) => (
  <NavBarCC>
    <WordMarkContainerStyledCC>
      <a href='/'>{WordMarkIcon}</a>
    </WordMarkContainerStyledCC>
    <ConnectButtonContainerCC>
      <GroupIconButtons>
        <IconButton
          onClick={() => setShowNotifications(!showNotifications)}
          disabled={false}
        >
          {
            notifications.some(noti => !noti.isRead) ? <NewIcons Icon={Notification} size={32} /> : <NewIcons Icon={NotificationR} size={32} />
          }
          
          
        </IconButton>
        <ButtonConnectionOver
          isConnected={isConnected}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          accountHashString={accountHashString}
        />
      </GroupIconButtons>
      {showNotifications && <NotificationList notifications={notifications} updateNotificationReadState={updateNotificationReadState}/>}
    </ConnectButtonContainerCC>
  </NavBarCC>
);
