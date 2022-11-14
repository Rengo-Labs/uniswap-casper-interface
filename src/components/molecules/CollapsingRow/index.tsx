import React, {useState} from 'react';
import useCollapse from 'react-collapsed';

import {AiFillStar, AiOutlineSwap} from "react-icons/ai";
import {Button, NewIcons} from '../../atoms'
import { useNavigate } from 'react-router-dom';

import {
    CircleButton,
    TBodyExpanded,
    TColumn6,
    TColumn3,
    TColumn1,
    TRow,
    TWrapRow,
    WrappedRow
} from "../POCTBody/styles";
import {TiArrowSortedDown, TiArrowSortedUp} from "react-icons/ti";
import {TbTrash} from "react-icons/tb";
import {SwapIconImageStyled} from "../SwapToken/styles";
import {ReactComponent as FarmIcon} from '../../../assets/newIcons/farmIconCyan.svg'
import {lightTheme} from "../../../contexts/ThemeContext/themes";
import {convertNumber} from "../../../contexts/ConfigContext";
import { Row } from 'react-table';
import { PairData } from '../../../reducers/PairsReducer';
import BigNumber from 'bignumber.js';

export interface CollapsingRowProps {
    row: Row<PairData>,
    fullExpanded?: boolean,
}

export const CollapsingRow = ({
    row, 
    fullExpanded = false,
}: CollapsingRowProps)  => {
    const [ isExpanded, setExpanded ] = useState(fullExpanded);
    const navigate = useNavigate()

    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

    const handleOnClick = () => {
        setExpanded(!isExpanded);
    }

    const goTo = (path, optional='') => {
        navigate({pathname: path, search: `token0=${row.original.token0Symbol.replace('WCSPR', 'CSPR')}&token1=${row.original.token1Symbol.replace('WCSPR', 'CSPR')}${optional}`})
    }

    return (
        <TWrapRow className="collapsible" {...row.getRowProps()} >
            <TRow {...getToggleProps({onClick: handleOnClick}) }>
                <TColumn6 style={{display: "flex"}}>
                    <TColumn1 style={{alignSelf: "center"}}><AiFillStar style={{color: lightTheme.secondBackgroundColor}}/></TColumn1>
                    <TColumn1 style={{display: "flex"}}>
                        <SwapIconImageStyled src={row.original.token0Icon} width="30" height="30" />
                        <SwapIconImageStyled style={{position: "relative", left: "-12px"}} src={row.original.token1Icon} width="30" height="30" />
                    </TColumn1>
                    <div style={{flex: "3", alignSelf: "center", textAlign: "left"}}>{row.original.name}</div>
                </TColumn6>
                <TColumn3 style={{display: "flex"}}>
                    <TColumn1 />
                    <TColumn3 style={{textAlign: "left"}}>
                        $ {convertNumber(parseFloat(row.original.totalSupply))}
                    </TColumn3>
                </TColumn3>
                <TColumn3>$ {row.original.volume7d}</TColumn3>
                <TColumn3>$ {row.original.fees24h}</TColumn3>
                <TColumn3>{row.original.oneYFees} %</TColumn3>
                <TColumn1>{isExpanded ? <TiArrowSortedUp /> : <TiArrowSortedDown />}</TColumn1>
            </TRow>
            <TBodyExpanded {...getCollapseProps()}>
                <WrappedRow>
                    <TColumn3>
                        <TRow style={{color: lightTheme.secondBackgroundColor}}>
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>Assets Pooled</TColumn3>
                        </TRow>
                        <TRow>
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>{convertNumber(parseFloat(row.original.reserve0))} {row.original.token0Symbol}</TColumn3>
                        </TRow>
                        <TRow>
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>{convertNumber(parseFloat(row.original.reserve1))} {row.original.token1Symbol}</TColumn3>
                        </TRow>
                    </TColumn3>
                    <TColumn6>
                        <TRow style={{color: lightTheme.secondBackgroundColor}}>
                            <TColumn1 />
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>Your Liquidity</TColumn3>
                        </TRow>
                        <TRow>
                            <TColumn1 />
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>$ {convertNumber(parseFloat(row.original.totalLiquidityUSD))}</TColumn3>
                        </TRow>
                        <TRow>
                            <TColumn1 />
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>{convertNumber(parseFloat(row.original.balance))} LP</TColumn3>
                        </TRow>
                    </TColumn6>
                    <TColumn3>
                        <TRow style={{color: lightTheme.secondBackgroundColor}}>
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>
                                Your Share
                            </TColumn3>
                        </TRow>
                        <TRow>
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>
                                {
                                    row.original.balance ?
                                    new BigNumber(row.original.balance).div(row.original.totalSupply).times(100).toFixed(2) : 0
                                } %
                            </TColumn3>
                        </TRow>
                    </TColumn3>
                    <TColumn3>
                        <TRow>
                            <Button style={{borderRadius: "10px", width: "10vw", height: "4.6vh"}} content={'Add Liquidity'} handler={() => {
                                goTo("/liquidity")
                            }}/>
                        </TRow>
                    </TColumn3>
                    <TColumn3>
                        <TRow>
                            <CircleButton onClick={() => {goTo("/swap")}}>
                                <AiOutlineSwap style={{alignSelf: "center", transform: "rotate(90deg)", color: lightTheme.thirdBackgroundColor}} size="1.3rem" />
                            </CircleButton>
                            <CircleButton disabled={parseFloat(row.original.balance) <= 0} onClick={() => {goTo("/liquidity", '&remove=true')}}>
                                <TbTrash style={{alignSelf: "center", color: lightTheme.thirdBackgroundColor}} size="1.3rem"/>
                            </CircleButton>
                            {false &&
                                <CircleButton onClick={() => {goTo("/farms")}}>
                                    <NewIcons Icon={FarmIcon} style={{alignSelf: "center"}} size="22px" />
                                </CircleButton>
                            }
                        </TRow>
                    </TColumn3>
                    <TColumn1 />
                </WrappedRow>
            </TBodyExpanded>
        </TWrapRow>
    );
}
