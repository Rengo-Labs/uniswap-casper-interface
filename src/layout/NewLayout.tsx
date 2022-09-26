import React, { useState } from 'react'
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
import { NewIcons } from '../components/atoms'

const LayoutStyled = styled.div<any>`
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: ${props => props.collapse ? "5% auto" : "15% auto"};
    grid-template-rows: 1fr;
    transition: all 500ms ease;
`

const NewNavigationStyled = styled.nav`
    background-color:red;
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
    background-color:${props => props.active ? "green" : ""};
    grid-template-columns: 1fr 2fr;
`
function NavItem({ children, collapse }) {
    const [active, setActive] = useState(false)
    return (<NavItemStyled
        onMouseEnter={() => { setActive(!active) }}
        onMouseLeave={() => { setActive(!active) }}
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
    { icon: SwapIcon, text: "Swap" },
    { icon: LiquidityIcon, text: "Liquidity" },
    { icon: PoolIcon, text: "Pools" },
    { icon: FarmIcon, text: "Farms" },
    { icon: StakingIcon, text: "Staking" },
    { icon: NftIcon, text: "NFT" },
]

const IconTextsTwo = [
    { icon: ConfigIcon, text: "Settings" },
    { icon: CommunityIcon, text: "Community" },
    { icon: CasperIcon, text: "CasperSwap" },
]
const NewLayout = ({ children }) => {
    const [collapse, setCollapse] = useState(true)
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
            <div>{children}</div>
        </LayoutStyled>

    )
}

export default NewLayout