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
import { SettingMenu } from '../components/molecules'
import { CommunityMenu, MenuOption } from '../components/molecules/CommunityMenu'

const size = 20


const settingMenuOptions: MenuOption[] = [
  { text: "Twitter", navegateTo: "https://www.twitter.com" },
  { text: "Discord", navegateTo: "https://www.discord.com" },
  { text: "Instagram", navegateTo: "https://www.instagram.com"},
]

const IconTexts = [
  { icon: SwapIcon, text: "Swap", path: "/swap" },
  { icon: LiquidityIcon, text: "Liquidity", path: "/liquidity" },
  { icon: PoolIcon, text: "Pools", path: "/pools" },
  /*{ icon: FarmIcon, text: "Farms", path: "/farms" },
  { icon: StakingIcon, text: "Staking", path: "/staking" },
  { icon: NftIcon, text: "NFT", path: "/nft" },*/
]

const IconTextsTwo = [
  { icon: ConfigIcon, text: "Settings", component: <SettingMenu/> },
  { icon: CommunityIcon, text: "Community", component: <CommunityMenu communityOptions={settingMenuOptions} />},
  { icon: CasperIcon, text: "CasperSwap", component: null},
]

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
  const [selectedOption, setSelectedOption] = useState<string>('')

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

  function handleMouseEnter(option: string) {
    setSelectedOption(option)
  }

  function handleMouseLeave() {
    setSelectedOption('')
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
                  onMouseEnter={() => handleMouseEnter(x.text)}
                  onMouseLeave={() => handleMouseLeave()}
                >
                  <IconTextCC collapse={collapse}
                    iconSet={<NewIcons Icon={x.icon} size={size} />}
                    text={x.text}
                  />
                  {selectedOption === x.text && x.component}
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
          />
          {children}
        </MainSpaceCC>
      </LayoutStyledCC>
    </>
  )
}

export default NewLayout