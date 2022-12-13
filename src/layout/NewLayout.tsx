import React, { useContext, useState } from 'react'
import { ReactComponent as CasperIcon } from '../assets/logo.svg'
import { ReactComponent as LiquidityIcon } from '../assets/newIcons/liquidityIcon.svg'
import { ReactComponent as PoolIcon } from '../assets/newIcons/poolIcon.svg'
import { ReactComponent as SwapIcon } from '../assets/newIcons/swapIcon.svg'
import { ReactComponent as ConfigIcon } from '../assets/newIcons/configIcon.svg'
import { ReactComponent as CommunityIcon } from '../assets/newIcons/communityIcon.svg'
import { ReactComponent as WordMarkIcon } from '../assets/newIcons/casperswap-wordmark.svg'
import {
  CollapseButtonCC,
  ExpansionAreaCC,
  IconTextCC,
  LayoutStyledCC,
  LogoIconCC,
  MainSpaceCC,
  MenuCenterCC,
  NavBarCD,
  NavItemCC,
  NewIcons,
  NewNavigationCC,
} from '../components/atoms'
import { useNavigate } from "react-router-dom";
import { ConfigProviderContext } from '../contexts/ConfigContext'
import { ButtonConnectionOver } from "../components/organisms/ButtonConnectionOver";
import { WalletName } from '../commons'
import { INotification } from '../components/molecules/NotificationList'

const size = 20

const IconTexts = [
  { icon: SwapIcon, text: "Swap", path: "/swap" },
  { icon: LiquidityIcon, text: "Liquidity", path: "/liquidity" },
  { icon: PoolIcon, text: "Pools", path: "/pools" },
  /*{ icon: FarmIcon, text: "Farms", path: "/farms" },
  { icon: StakingIcon, text: "Staking", path: "/staking" },
  { icon: NftIcon, text: "NFT", path: "/nft" },*/
]

const IconTextsTwo = [
  { icon: ConfigIcon, text: "Settings" },
  { icon: CommunityIcon, text: "Community" },
  { icon: CasperIcon, text: "CasperSwap" },
]

const notificationList: INotification[] = [
  {
    id: '1',
    message: 'This is the Notification 1',
    isRead: true,
  },
  {
    id: '2',
    message: 'Notification 2',
    isRead: false,
  },
  {
    id: '3',
    message: 'Notification 3',
    isRead: true,
  },
];

export interface NewLayoutProps {
  children?: React.ReactElement
  title?: string,
}

const NewLayout = ({
  children,
  title = ""
}: NewLayoutProps) => {
  const navigate = useNavigate()
  const [collapse, setCollapse] = useState(true)
  const [showNotifications, setShowNotifications] = useState<boolean>(false)
  const [notifications, setNotifications] = useState<INotification[]>(notificationList)

  const {
    onConnectWallet,
    onDisconnectWallet,
    configState,
  } = useContext(ConfigProviderContext)

  const {
    isConnected,
    walletAddress
  } = configState

  function onConnect(name: WalletName) {
    onConnectWallet(name)
  }

  function onDisconnect() {
    onDisconnectWallet()
  }

  function updateNotificationReadState(id: string) {
    console.log('updateNotificationReadState', id);
    setNotifications((prev) =>
      prev.map((x) => {
        if (x.id === id) {
          return { ...x, isRead: true };
        }
        return x;
      })
    );
  }

  return (
    <>
      <ExpansionAreaCC
        collapse={collapse}
        onMouseEnter={() => setCollapse(false)}
      >
      </ExpansionAreaCC>
      <LayoutStyledCC collapse={collapse}>
        <NewNavigationCC
          onMouseLeave={() => setCollapse(true)}
        >
          <CollapseButtonCC>
            <a href='/'>
              <LogoIconCC collapse={false} onNewIcons={<NewIcons Icon={CasperIcon} size={64} />}>
                casperswap
              </LogoIconCC>
            </a>
          </CollapseButtonCC>
          <MenuCenterCC>
            {IconTexts.map(x => {
              return (
                <NavItemCC key={x.text}
                  redirect={() => { navigate(x.path) }}
                  collapse={collapse}
                >
                  <IconTextCC collapse={collapse}
                    iconSet={<NewIcons Icon={x.icon} size={size} />}
                    text={x.text}
                  />
                </NavItemCC>
              )
            })}
          </MenuCenterCC>
          <MenuCenterCC>
            {IconTextsTwo.map(x => {
              return (
                <NavItemCC key={x.text}
                  redirect={() => { }}
                  collapse={collapse}
                >
                  <IconTextCC collapse={collapse}
                    iconSet={<NewIcons Icon={x.icon} size={size} />}
                    text={x.text}
                  />
                </NavItemCC>
              )
            })}
          </MenuCenterCC>
        </NewNavigationCC>
        <MainSpaceCC>
          <NavBarCD
            isConnected={isConnected}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            accountHashString={walletAddress}
            WordMarkIcon={<WordMarkIcon />}
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            updateNotificationReadState={updateNotificationReadState}
          />
          {children}
        </MainSpaceCC>
      </LayoutStyledCC>
    </>
  )
}

export default NewLayout
