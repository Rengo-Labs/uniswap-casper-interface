import React, {useContext, useState} from 'react';
import useCollapse from 'react-collapsed';

import {AiOutlineSwap} from "react-icons/ai";

import {
    TBodyExpanded,
    TColumn1,
    TRow,
    TWrapRow,
    WrappedRow,
    CircleButton
} from "./styles";
import {TiArrowSortedDown, TiArrowSortedUp} from "react-icons/ti";
import {SwapIconImageStyled} from "../SwapToken/styles";
import {lightTheme} from "../../../contexts/ThemeContext/themes";
import {Button, NewIcons} from "../../atoms";
import {ReactComponent as FarmIcon} from "../../../assets/newIcons/farmIconCyan.svg";
import {useNavigate} from "react-router-dom";
import {ConfigProviderContext} from "../../../contexts/ConfigContext";


export const LiquidityItem = ({firstIcon, firstSymbol, firstLiquidity, secondIcon, secondSymbol, secondLiquidity, liquidity, perLiquidity, fullExpanded = false, children}:any)  => {
    const [ isExpanded, setExpanded ] = useState(fullExpanded);
    const navigate = useNavigate()
    const {
        onSelectFirstToken,
        onSelectSecondToken,
        tokens
    } = useContext(ConfigProviderContext)
    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

    const handleOnClick = () => {
        setExpanded(!isExpanded);
    }

    const selectLiquidity = () => {
        onSelectFirstToken(tokens[firstSymbol])
        onSelectSecondToken(tokens[secondSymbol])
    }

    const goTo = (path) => {
        navigate({pathname: path, search: `token0=${firstSymbol}&token1=${secondSymbol}`})
    }

    return (
        <TWrapRow  className="collapsible">
            <TRow style={{cursor: "pointer", padding: "3px 25px"}} {...getToggleProps({onClick: handleOnClick}) }>
                <TColumn1 style={{display: "flex"}}>
                    <TColumn1 style={{display: "flex"}}>
                        <SwapIconImageStyled src={firstIcon} width="30" height="30" />
                        <SwapIconImageStyled style={{position: "relative", left: "-10px"}} src={secondIcon} width="30" height="30" />
                    </TColumn1>
                    <div style={{flex: "3", alignSelf: "center", textAlign: "left"}}>{firstSymbol}-{secondSymbol}</div>
                </TColumn1>
                <TColumn1 style={{textAlign: "right", color: lightTheme.secondBackgroundColor}}>{isExpanded ? <TiArrowSortedUp /> : <TiArrowSortedDown />}</TColumn1>
            </TRow>
            <TBodyExpanded {...getCollapseProps()}>
                <div style={{paddingLeft: "20px", paddingRight: "20px", paddingTop: "10px"}}>
                    <div style={{borderTop: "1px solid black"}}/>
                </div>
                <WrappedRow>
                    <TColumn1>
                        Pooled ({firstSymbol})
                    </TColumn1>
                    <TColumn1 style={{textAlign: "right", color: lightTheme.secondBackgroundColor}}>
                        {firstLiquidity} {firstSymbol}
                    </TColumn1>
                </WrappedRow>
                <WrappedRow>
                    <TColumn1>
                        Pooled ({secondSymbol})
                    </TColumn1>
                    <TColumn1 style={{textAlign: "right", color: lightTheme.secondBackgroundColor}}>
                        {secondLiquidity} {secondSymbol}
                    </TColumn1>
                </WrappedRow>
                <WrappedRow>
                    <TColumn1>
                        Your liquidity
                    </TColumn1>
                    <TColumn1 style={{textAlign: "right", color: lightTheme.secondBackgroundColor}}>
                        {liquidity} LP
                    </TColumn1>
                </WrappedRow>
                <WrappedRow>
                    <TColumn1>
                        Your share
                    </TColumn1>
                    <TColumn1 style={{textAlign: "right", color: lightTheme.secondBackgroundColor}}>
                        {perLiquidity} %
                    </TColumn1>
                </WrappedRow>
                <WrappedRow>
                    <TColumn1>
                        <TRow>
                            <Button style={{borderRadius: "10px", width: "8vw", height: "4.6vh"}} content={'Add Liquidity'} handler={selectLiquidity}/>
                        </TRow>
                    </TColumn1>
                    <TColumn1>
                        <TRow>
                            <CircleButton onClick={() => {goTo("/swap")}}>
                                <AiOutlineSwap style={{alignSelf: "center", transform: "rotate(90deg)", color: lightTheme.thirdBackgroundColor}} size="1.3rem" />
                            </CircleButton>
                            {children}
                            {false &&
                                <CircleButton onClick={() => {}}>
                                    <NewIcons Icon={FarmIcon} style={{alignSelf: "center"}} size="22px" />
                                </CircleButton>
                            }
                        </TRow>
                    </TColumn1>
                </WrappedRow>
            </TBodyExpanded>
        </TWrapRow>
    );
}