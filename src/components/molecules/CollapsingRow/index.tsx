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

export const CollapsingRow = ({row, fullExpanded = false}:any)  => {
    const [ isExpanded, setExpanded ] = useState(fullExpanded);
    const navigate = useNavigate()

    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

    const handleOnClick = () => {
        setExpanded(!isExpanded);
    }

    const goTo = (path, optional='') => {
        navigate({pathname: path, search: `token0=${row.original.pair.token0}&token1=${row.original.pair.token1}${optional}`})
        /*navigate('/liquidity',  {
            state: {
                itemId: 86,
                otherParam: 'anything you want here',
            }
        })*/
    }

    return (
        <TWrapRow className="collapsible" {...row.getRowProps()} >
            <TRow {...getToggleProps({onClick: handleOnClick}) }>
                <TColumn6 style={{display: "flex"}}>
                    <TColumn1 style={{alignSelf: "center"}}><AiFillStar style={{color: lightTheme.secondBackgroundColor}}/></TColumn1>
                    <TColumn1 style={{display: "flex"}}>
                        <SwapIconImageStyled src={row.original.tokeIcon1} width="30" height="30" />
                        <SwapIconImageStyled style={{position: "relative", left: "-12px"}} src={row.original.tokeIcon2} width="30" height="30" />
                    </TColumn1>
                    <div style={{flex: "3", alignSelf: "center", textAlign: "left"}}>{row.original.tokenName}</div>
                </TColumn6>
                <TColumn3 style={{display: "flex"}}>
                    <TColumn1 />
                    <TColumn3 style={{textAlign: "left"}}>
                        $ {row.original.tokenLiquidity}
                    </TColumn3>
                </TColumn3>
                <TColumn3>$ {row.original.volume7d}</TColumn3>
                <TColumn3>$ {row.original.fees24h}</TColumn3>
                <TColumn3>{row.original.oneYFees} %</TColumn3>
                <TColumn1>{isExpanded ? <TiArrowSortedUp /> : <TiArrowSortedDown />}</TColumn1>
            </TRow>
            <TBodyExpanded {...getCollapseProps()}>
                <WrappedRow>
                    <TColumn6>
                        <TRow style={{color: lightTheme.secondBackgroundColor}}>
                            <TColumn1 />
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>Your Liquidity</TColumn3>
                        </TRow>
                        <TRow>
                            <TColumn1 />
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>$ {row.original.pair.totalLiquidityUSD}</TColumn3>
                        </TRow>
                        <TRow>
                            <TColumn1 />
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>{row.original.pair.totalLiquidityPool} LP</TColumn3>
                        </TRow>
                    </TColumn6>
                    <TColumn3>
                        <TRow style={{color: lightTheme.secondBackgroundColor}}>
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>Assets Pooled</TColumn3>
                        </TRow>
                        <TRow>
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>{row.original.pair.token0Liquidity} {row.original.pair.token0}</TColumn3>
                        </TRow>
                        <TRow>
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>{row.original.pair.token1Liquidity} {row.original.pair.token1}</TColumn3>
                        </TRow>
                    </TColumn3>
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
                                    row.original.pair.volume ?
                                    row.original.pair.volume / row.original.volume : 0
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
                            <CircleButton disabled={row.original.pair.totalPool <= 0} onClick={() => {goTo("/liquidity", '&remove=true')}}>
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
