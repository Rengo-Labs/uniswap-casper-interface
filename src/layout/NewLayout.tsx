import React, { useState } from 'react'
import styled from 'styled-components'
import CasperIcon from '../assets/newIcons/casperIcon.svg'

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
    padding:5px;
    display: flex;
    justify-content: space-evenly;
    &:active{ 
        background-color:green;
    }
`
function NavItem({ children }) {
    const [active, setActive] = useState(false)
    return (<NavItemStyled
        onMouseEnter={() => { setActive(!active) }}
        onMouseLeave={() => { setActive(!active) }}
        style={{ backgroundColor: active ? "green" : "" }}
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
function RenderIcons({ icon, size }) {
    return (
        <img src={icon} width={size} height={size} />
    )
}
function IconText({ collapse, iconSet }) {
    return (
        <>
            {iconSet}
            {!collapse && <div>2</div>}
        </>)
}
const size = "25"
const NewLayout = ({ children }) => {
    const [collapse, setCollapse] = useState(true)
    return (
        <LayoutStyled collapse={collapse}>
            <NewNavigation
                onMouseEnter={() => setCollapse(!collapse)}
                onMouseLeave={() => setCollapse(!collapse)}
            >
                <CollapseButton>
                    {collapse ? <RenderIcons icon={CasperIcon} size={size} /> : "casperswap"}
                </CollapseButton>
                <MenuCenter>
                    <NavItem>
                        <IconText collapse={collapse}
                            iconSet={<RenderIcons icon={CasperIcon} size={size} />}
                        />
                    </NavItem>
                    <NavItem>2</NavItem>
                    <NavItem>3</NavItem>
                    <NavItem>4</NavItem>
                    <NavItem>5</NavItem>
                    <NavItem>6</NavItem>
                </MenuCenter>
                <div>
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                </div>
            </NewNavigation>
            <div>{children}</div>
        </LayoutStyled>

    )
}

export default NewLayout