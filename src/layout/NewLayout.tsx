import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as CasperIcon } from '../assets/newIcons/casperIcon.svg'
import { ReactComponent as FarmIcon } from '../assets/newIcons/farmIcon.svg'
import { ReactComponent as LiquidityIcon } from '../assets/newIcons/liquidityIcon.svg'
import { ReactComponent as NftIcon } from '../assets/newIcons/nftIcon.svg'
import { ReactComponent as PoolIcon } from '../assets/newIcons/poolIcon.svg'
import { ReactComponent as StakingIcon } from '../assets/newIcons/stakingIcon.svg'
import { ReactComponent as SwapIcon } from '../assets/newIcons/swapIcon.svg'
import { ReactComponent as ConfigIcon } from '../assets/newIcons/configIcon.svg'
import { ReactComponent as CommunityIcon } from '../assets/newIcons/communityIcon.svg'
import { ButtonConnection, NewIcons } from '../components/atoms'
import { useNavigate } from "react-router-dom";
import { ConfigProviderContext } from '../contexts/ConfigContext'
import OctoPurple from '../components/atoms/OctoPurple'

const CLOSED_WIDTH = '108px'
const OPEN_WIDTH = '280px'

const ExpansionAreaStyled = styled.div<any>`
    width: ${props => props.collapse ? OPEN_WIDTH : 0};
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
`

const ExpansionArea = ({ children, collapse, onMouseEnter }) => (
    <ExpansionAreaStyled collapse={collapse} onMouseEnter={onMouseEnter}>{children}</ExpansionAreaStyled>
)

const LayoutStyled = styled.div<any>`
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: ${props => props.collapse ? CLOSED_WIDTH + " auto" : OPEN_WIDTH + " auto"};
    grid-template-rows: 1fr;
    transition: all 500ms ease;
`

//TODO navbar background
const NewNavigationStyled = styled.nav`
    background-color: rgb(120,100,244);
    display: grid;
    padding: 32px 0;
    grid-template: auto 1fr auto / auto;
    justify-items: center;
`

const NewNavigation = ({ children, onMouseLeave }) => (
    <NewNavigationStyled onMouseLeave={onMouseLeave}>{children}</NewNavigationStyled>
)
    
const MenuCenterStyled = styled.main`
    width: 100%;
    align-self: center;
`
function MenuCenter({ children }) {
    return (<MenuCenterStyled>{children}</MenuCenterStyled>)
}

const NavItemStyled = styled.nav<any>`
    box-sizing: border-box;
    width: 100%;
    padding: 10px 1.2em;
    cursor: pointer;
    display: flex;
    gap: ${props => props.collapse ? "0" : "40px"};
    justify-content: center;
    align-items: center;
    transition: all 100ms ease;
    
    & svg {
        stroke: white;
        fill: white;
        transition: all 100ms ease;
    }

    &:hover {
        background-color: white;
        color: #715FF5;

        svg {
            stroke: #715FF5;
            fill: #715FF5;
        }
    }
`
const NavItem = ({ children, redirect, collapse }: any) => (
    <NavItemStyled    
        onClick={redirect}
        collapse={collapse}
    >
        {children}
    </NavItemStyled>
)

const CollapseButtonStyled = styled.button`
    all:unset;
`
const CollapseButton = ({ children }) => {
    return (<CollapseButtonStyled>{children}</CollapseButtonStyled>)
}

const IconTextStyled = styled.nav<any>`
    opacity: ${props => props.collapse ? "0" : "1"};
    width: ${props => props.collapse ? "0px" : "100%"};
    transition: all 200ms ease;
    font-size: 18px;
    letter-spacing: 4.68px;
`

const IconText = ({ collapse, iconSet, text }) => {
    return (
        <>
            {iconSet}
            <IconTextStyled collapse={collapse}>{text}</IconTextStyled>
        </>)
}
const size = 20
const IconTexts = [
    { icon: SwapIcon, text: "Swap", path: "/swap" },
    { icon: LiquidityIcon, text: "Liquidity", path: "/liquidity" },
    { icon: PoolIcon, text: "Pools", path: "/pools" },
    { icon: FarmIcon, text: "Farms", path: "/farms" },
    { icon: StakingIcon, text: "Staking", path: "/staking" },
    { icon: NftIcon, text: "NFT", path: "/nft" },
]

const IconTextsTwo = [
    { icon: ConfigIcon, text: "Settings" },
    { icon: CommunityIcon, text: "Community" },
    { icon: CasperIcon, text: "CasperSwap" },
]

//TODO container background
const MainSpaceStyled = styled.main`
    background-color: rgba(247,252,253,255);
    height:100%;
    width:100%;
    display:grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
`
const MainSpace = ({ children }) => {
    return (<MainSpaceStyled>{children}</MainSpaceStyled>)
}
const NavBarStyled = styled.nav`
    padding:10px;
    display:grid;
    grid-template: auto / repeat(6, 1fr);
`
const NavBar = ({ children }) => {
    return (<NavBarStyled>{children}</NavBarStyled>)
}

const IconContainerStyled = styled.nav`
    grid-column: 4/5;
`
const IconContainer = ({ children }) => {
    return (<IconContainerStyled>{children}</IconContainerStyled>)
}

const TitleCellContainerStyled = styled.nav`
    grid-column: 3;
    grid-row: 1;
    color: ${props => props.theme.secondBackgroundColor};
    text-align: center;
    font-size: 2em;
`

const CallContainerStyled = styled.nav`
    grid-column: 6/7;
`
const CallContainer = ({ children }) => (
    <CallContainerStyled>{children}</CallContainerStyled>
)

const LogoIconStyled = styled.nav`
    & svg {
        stroke: white;
        fill: white;
    }
`

const LogoIcon = ({ collapse, children }) => (
    <LogoIconStyled>
        { !collapse ? <NewIcons Icon={CasperIcon} size={64} /> : <div style={{height: 64}}>{ children }</div> }
    </LogoIconStyled>
)

const NewLayout = ({ children, title = "" }) => {
    const navigate = useNavigate()
    const [collapse, setCollapse] = useState(true)

    const { onConnectConfig, onDisconnectWallet, onChangeWallet, configState, pairState } = useContext(ConfigProviderContext)

    const {
        isConnected,
        walletAddress,
        walletSelected,
        languagesSelected,
        visualModeSelected,
        slippageToleranceSelected,
        gasPriceSelected } = configState

    async function onConnect() {
        onConnectConfig()
    }
    async function onDisconnect() {
        onDisconnectWallet()
    }

    return (
        <>
            <ExpansionArea
                collapse={collapse}
                onMouseEnter={() => setCollapse(false)}
            >
            </ExpansionArea>
            <LayoutStyled collapse={collapse}>
                <NewNavigation
                    onMouseLeave={() => setCollapse(true)}
                >
                    <CollapseButton>
                        <LogoIcon collapse={false}>
                            casperswap
                        </LogoIcon>
                    </CollapseButton>
                    <MenuCenter>
                        {IconTexts.map(x => {
                            return (
                                <NavItem key={x.text}
                                    redirect={() => { navigate(x.path) }}
                                    collapse={collapse}
                                >
                                    <IconText collapse={collapse}
                                        iconSet={<NewIcons Icon={x.icon} size={size} />}
                                        text={x.text}
                                    />
                                </NavItem>
                            )
                        })}
                    </MenuCenter>
                    <MenuCenter>
                        {IconTextsTwo.map(x => {
                            return (
                                <NavItem key={x.text}
                                    redirect={() => { }}
                                    collapse={collapse}
                                >
                                    <IconText collapse={collapse}
                                        iconSet={<NewIcons Icon={x.icon} size={size} />}
                                        text={x.text}
                                    />
                                </NavItem>
                            )
                        })}
                    </MenuCenter>
                </NewNavigation>
                <MainSpace>
                    <NavBar>
                        <IconContainer>
                            <OctoPurple />
                        </IconContainer>
                        <TitleCellContainerStyled>{title}</TitleCellContainerStyled>
                        <CallContainer>
                            <ButtonConnection 
                                isConnected={isConnected} 
                                onConnect={onConnect} 
                                onDisconnect={onDisconnect} 
                                Account={walletAddress} 
                            />
                        </CallContainer>
                    </NavBar>
                    {children}
                </MainSpace>
            </LayoutStyled>
        </>
    )
}

export default NewLayout