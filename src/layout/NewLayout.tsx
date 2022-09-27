import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import CasperIcon from '../assets/newIcons/casperIcon.svg'
import FarmIcon from '../assets/newIcons/farmIcon.svg'
import LiquidityIcon from '../assets/newIcons/liquidityIcon.svg'
import NftIcon from '../assets/newIcons/nftIcon.svg'
import PoolIcon from '../assets/newIcons/poolIcon.svg'
import StakingIcon from '../assets/newIcons/stakingIcon.svg'
import SwapIcon from '../assets/newIcons/swapIcon.svg'
import ConfigIcon from '../assets/newIcons/configIcon.svg'
import CommunityIcon from '../assets/newIcons/communityIcon.svg'
import { ButtonConnection, NewIcons } from '../components/atoms'
import { useNavigate } from "react-router-dom";
import { ConfigProviderContext } from '../contexts/ConfigContext'


const LayoutStyled = styled.div<any>`
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: ${props => props.collapse ? "5% auto" : "15% auto"};
    grid-template-rows: 1fr;
    transition: all 500ms ease;
`

const NewNavigationStyled = styled.nav`
    background-color:rgba(255,255,255,.1);
    display: grid;
    padding:10px 0;
    grid-template: auto 1fr auto / auto;
    justify-items: center;
`
function NewNavigation({ children, onMouseEnter, onMouseLeave }) {
    return (<NewNavigationStyled onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>{children}</NewNavigationStyled>)
}
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
    padding:5px 1.2em;
    display: ${props => props.collapse ? "flex" : "grid"};
    gap:1em;
    justify-content: ${props => props.collapse ? "center" : "space-between"};
    align-items:center;
    background-color:${props => props.active ? "rgba(255,255,255,.4)" : ""};
    grid-template-columns: 1fr 2fr;
`
function NavItem({ children, redirect, collapse }: any) {
    const [active, setActive] = useState(false)
    return (<NavItemStyled
        onMouseEnter={() => { setActive(!active) }}
        onMouseLeave={() => { setActive(!active) }}
        onClick={redirect}
        active={active}
        collapse={collapse}
    >
        {children}
    </NavItemStyled>)
}

const CollapseButtonStyled = styled.button`
    all:unset;
`
function CollapseButton({ children }) {
    return (<CollapseButtonStyled>{children}</CollapseButtonStyled>)
}

function IconText({ collapse, iconSet, text }) {
    return (
        <>
            {iconSet}
            {!collapse && <div>{text}</div>}
        </>)
}
const size = "25"
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
const MainSpaceStyled = styled.main`
    height:100%;
    width:100%;
    display:grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
`
function MainSpace({ children }) {
    return (<MainSpaceStyled>{children}</MainSpaceStyled>)
}
const NavBarStyled = styled.nav`
    padding:10px;
    display:grid;
    grid-template: auto / repeat(6, 1fr);
`
function NavBar({ children }) {
    return (<NavBarStyled>{children}</NavBarStyled>)
}

const IconContainerStyled = styled.nav`
    grid-column: 4/5;
`
function IconContainer({ children }) {
    return (<IconContainerStyled>{children}</IconContainerStyled>)
}

const CallContainerStyled = styled.nav`
        grid-column: 6/7;

`
function CallContainer({ children }) {
    return (<CallContainerStyled>{children}</CallContainerStyled>)
}
const NewLayout = ({ children }) => {
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
        <LayoutStyled collapse={collapse}>
            <NewNavigation
                onMouseEnter={() => setCollapse(!collapse)}
                onMouseLeave={() => setCollapse(!collapse)}
            >
                <CollapseButton>
                    {collapse ? <NewIcons icon={CasperIcon} size={40} /> : "casperswap"}
                </CollapseButton>
                <MenuCenter>
                    {IconTexts.map(x => {
                        return (
                            <NavItem key={x.text}
                                redirect={() => { navigate(x.path) }}
                                collapse={collapse}
                            >
                                <IconText collapse={collapse}
                                    iconSet={<NewIcons icon={x.icon} size={size} />}
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
                                    iconSet={<NewIcons icon={x.icon} size={size} />}
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
                        <NewIcons icon={CasperIcon} size={40} />
                    </IconContainer>
                    <CallContainer>
                        <ButtonConnection isConnected={isConnected} onConnect={onConnect} onDisconnect={onDisconnect} Account={walletAddress} />
                    </CallContainer>
                </NavBar>
                {children}
            </MainSpace>
        </LayoutStyled>

    )
}

export default NewLayout