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
}

export const NavBarCD = ({
  isConnected,
  onConnect,
  onDisconnect,
  accountHashString,
  WordMarkIcon,
}: NavBarCDProps) => (
  <NavBarCC>
    <WordMarkContainerStyledCC>
      <a href='/'>{WordMarkIcon}</a>
    </WordMarkContainerStyledCC>
    <ConnectButtonContainerCC>
      <GroupIconButtons>
        <ButtonConnectionOver
          isConnected={isConnected}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          accountHashString={accountHashString}
        />
      </GroupIconButtons>
    </ConnectButtonContainerCC>
  </NavBarCC>
);
