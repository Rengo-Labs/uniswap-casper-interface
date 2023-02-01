import React, { useContext, useState } from 'react';
import { ReactComponent as CasperIcon } from '../assets/logo.svg';
import { ReactComponent as LiquidityIcon } from '../assets/newIcons/liquidityIcon.svg';
import { ReactComponent as PoolIcon } from '../assets/newIcons/poolIcon.svg';
import { ReactComponent as SwapIcon } from '../assets/newIcons/swapIcon.svg';
import { ReactComponent as ConfigIcon } from '../assets/newIcons/configIcon.svg';
import { ReactComponent as CommunityIcon } from '../assets/newIcons/communityIcon.svg';
import { ReactComponent as WordMarkIcon } from '../assets/newIcons/casperswap-wordmark.svg';
import { ReactComponent as Twitter } from '../assets/newIcons/twitter.svg';
import { ReactComponent as Telegram } from '../assets/newIcons/telegram.svg';
import { ReactComponent as Discord } from '..//assets/newIcons/discord.svg';
import { ReactComponent as Linkedin } from '../assets/newIcons/linkedin.svg';
import { ReactComponent as Medium } from '../assets/newIcons/medium.svg';
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
  CasperIcons,
  ContainerMobile,
} from '../components/atoms';
import { useNavigate } from 'react-router-dom';
import { ConfigProviderContext } from '../contexts/ConfigContext';
import { WalletName } from '../commons';
import {
  SettingMenu,
  MobileMenu,
} from '../components/molecules';
import {
  CommunityMenu,
  MenuOption,
} from '../components/molecules/CommunityMenu';
import { INotification } from '../components/molecules/NotificationList';
import isMobileScreen from '../hooks/isMobileScreen';
import { MenuMobileOptions } from '../constant';

const size = 20;

export const settingMenuOptions: MenuOption[] = [
  { text: 'Twitter', navegateTo: 'https://twitter.com/casperswap', icon: Twitter },
  { text: 'Discord', navegateTo: 'https://discord.gg/uf2vfTNvEA', icon: Discord },
  {
    text: 'Telegram',
    navegateTo: 'https://t.me/casperswapofficial',
    icon: Telegram,
  },
  {
    text: 'Linkedin',
    navegateTo: 'https://www.linkedin.com/company/casperswap/',
    icon: Linkedin,
  },
  {
    text: 'Medium',
    navegateTo: 'https://medium.com/@casperswap',
    icon: Medium,
  },
  {
    text: 'Announcement Channel',
    navegateTo: 'https://t.me/CasperSwapOfficialANN',
    icon: Telegram,
  },
];

const IconTexts = [
  { icon: SwapIcon, text: 'Swap', path: '/swap' },
  { icon: LiquidityIcon, text: 'Liquidity', path: '/liquidity' },
  //{ icon: PoolIcon, text: 'Pools', path: '/pools' },
  /*{ icon: FarmIcon, text: "Farms", path: "/farms" },
  { icon: StakingIcon, text: "Staking", path: "/staking" },
  { icon: NftIcon, text: "NFT", path: "/nft" },*/
];

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
  children?: React.ReactElement;
  title?: string;
}

const NewLayout = ({ children, title = '' }: NewLayoutProps) => {
  const navigate = useNavigate();
  const [collapse, setCollapse] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] =
    useState<INotification[]>(notificationList);
  const isMobile = isMobileScreen();

  const IconMenusMobile = [
    { icon: SwapIcon, text: 'Swap', path: '/swap' },
    { icon: LiquidityIcon, text: 'Liquidity', path: '/liquidity' },
    //{ icon: PoolIcon, text: 'Pools', path: '/pools' },
    {
      icon: ConfigIcon,
      text: MenuMobileOptions.Settings,
      component: <SettingMenu />,
    },
    {
      icon: CommunityIcon,
      text: MenuMobileOptions.Community,
      component: 
        <CommunityMenu communityOptions={settingMenuOptions} />
    },
    //{ icon: CasperIcon, text: "CasperSwap", component: null},
  ];

  const IconTextsTwo = [
    {
      icon: ConfigIcon,
      text: MenuMobileOptions.Settings,
      component: <SettingMenu />,
    },
    {
      icon: CommunityIcon,
      text: MenuMobileOptions.Community,
      component: 
        <CommunityMenu communityOptions={settingMenuOptions} />
    },
    //{ icon: CasperIcon, text: "CasperSwap", component: null},
  ];

  const { onConnectWallet, onDisconnectWallet, configState } = useContext(
    ConfigProviderContext
  );

  const { isConnected, walletAddress } = configState;

  function onConnect(name: WalletName) {
    onConnectWallet(name);
  }

  function onDisconnect() {
    onDisconnectWallet();
  }

  function handleMouseEnter(option: string) {
    setSelectedOption(option);
  }

  function handleMouseLeave() {
    setSelectedOption('');
  }

  function handleOpen() {
    setCollapse(!collapse);
    setSelectedOption('');
  }
  function updateNotificationReadState(id: string) {
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
      {isMobile ? (
        <ContainerMobile>
          <MainSpaceCC>
            <MobileMenu
              isConnected={isConnected}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
              accountHashString={walletAddress}
              icon={<CasperIcons Icon={CasperIcon} width={36} height={44} />}
              open={collapse}
              option={selectedOption}
              setOption={setSelectedOption}
              setOpen={handleOpen}
              menuIcons={
                <>
                  <MenuCenterCC>
                    <div style={{margin: '80px 0px 40px 0'}}>
                      <NavItemCC redirect={() => {}} collapse={false} isTitle={true}>
                        <IconTextCC
                          collapse={false}
                          iconSet={<NewIcons Icon={CasperIcon} size={28} />}
                          text='CasperSwap'
                          isTitle={true}
                        />
                      </NavItemCC>
                    </div>
                    {IconMenusMobile.map((x) => {
                      return (
                        <NavItemCC
                          key={x.text}
                          redirect={() => {
                            if (x.path) {
                              navigate(x.path);
                              setCollapse(!collapse);
                            }
                          }}
                          collapse={!collapse}
                          onMouseEnter={() => handleMouseEnter(x.text)}
                        >
                          <IconTextCC
                            collapse={!collapse}
                            iconSet={<NewIcons Icon={x.icon} size={size} />}
                            text={x.text}
                          />
                        </NavItemCC>
                      );
                    })}
                  </MenuCenterCC>
                </>
              }
            />
            {children}
          </MainSpaceCC>
        </ContainerMobile>
      ) : (
        <>
          <ExpansionAreaCC
            collapse={collapse}
            onMouseEnter={() => setCollapse(false)}
          >
          </ExpansionAreaCC>
          <LayoutStyledCC collapse={collapse}>
            <NewNavigationCC onMouseLeave={() => setCollapse(true)}>
              <CollapseButtonCC>
                <a href='/'>
                  <LogoIconCC
                    collapse={false}
                    onNewIcons={
                      <CasperIcons Icon={CasperIcon} width={36} height={44} />
                    }
                  >
                    casperswap
                  </LogoIconCC>
                </a>
              </CollapseButtonCC>
              <MenuCenterCC>
                {IconTexts.map((x) => {
                  return (
                    <NavItemCC
                      key={x.text}
                      redirect={() => {
                        navigate(x.path);
                      }}
                      collapse={collapse}
                    >
                      <IconTextCC
                        collapse={collapse}
                        iconSet={<NewIcons Icon={x.icon} size={size} />}
                        text={x.text}
                      />
                    </NavItemCC>
                  );
                })}
              </MenuCenterCC>
              <MenuCenterCC>
                {IconTextsTwo.map((x) => {
                  return (
                    <NavItemCC
                      key={x.text}
                      redirect={() => {}}
                      collapse={collapse}
                      onMouseEnter={() => handleMouseEnter(x.text)}
                      onMouseLeave={() => handleMouseLeave()}
                    >
                      <IconTextCC
                        collapse={collapse}
                        iconSet={<NewIcons Icon={x.icon} size={size} />}
                        text={x.text}
                      />
                      {selectedOption === x.text && x.component}
                    </NavItemCC>
                  );
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
              />
              {children}
            </MainSpaceCC>
          </LayoutStyledCC>
        </>
      )}
    </>
  );
};

export default NewLayout;
