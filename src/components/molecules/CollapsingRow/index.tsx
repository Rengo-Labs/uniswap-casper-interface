import React, {useState} from 'react';
import useCollapse from 'react-collapsed';

import {AiFillStar, AiOutlineSwap} from "react-icons/ai";
import {NewIcons} from '../../atoms'
import { useNavigate } from 'react-router-dom';

import {
    CircleButton,
    TBodyExpanded,
    TColumn6,
    TColumn3,
    TColumn1,
    IconColumn1,
    TBodyColumn3,
    TButtonColumn3,
    TBodyColumn6
} from "../POCTBody/styles";
import {TbTrash} from "react-icons/tb";
import {SwapIconImageStyled, SwapIconTwoImageStyled} from "../LiquidityItem/styles";
import {ReactComponent as FarmIcon} from '../../../assets/newIcons/farmIconCyan.svg'
import {lightTheme} from "../../../contexts/ThemeContext/themes";
import {convertNumber} from "../../../contexts/ConfigContext";
import { Row } from 'react-table';
import { PairData } from '../../../reducers/PairsReducer';
import BigNumber from 'bignumber.js';
import {FiChevronDown, FiChevronUp} from "react-icons/fi";
import {
    TRow,
    TWrapRow,
    TFirstRow,
    TitleStyled,
    TLeftRow,
    TSecondRow,
    TThirdRow,
    TWrapCardRow,
    WrappedRow,
    ValueStyled,
    AddLiquidityButton,
    NormalBodyRow,
    TColumn2andHalf,
    PairTitleColumn,
    TitleBodyRow
} from "./styles";

export interface CollapsingRowProps {
    row: Row<PairData>,
    fullExpanded?: boolean,
    isMobile?: boolean,
    onRemovingPopupListener: any
}

export const CollapsingRow = ({
    row, 
    fullExpanded = false,
    isMobile = false,
    onRemovingPopupListener
}: CollapsingRowProps)  => {
    const [ isExpanded, setExpanded ] = useState(fullExpanded);
    const navigate = useNavigate()

    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

    const handleOnClick = () => {
        setExpanded(!isExpanded);
    }

    const goTo = (path, removingPopup= false) => {
        if (removingPopup) {
            onRemovingPopupListener(true)
        }
        navigate({pathname: path, search: `token0=${row.original.token0Symbol.replace('WCSPR', 'CSPR')}&token1=${row.original.token1Symbol.replace('WCSPR', 'CSPR')}`})
    }

    return ( !isMobile ? <TWrapRow className="collapsible" {...row.getRowProps()} >
            <TRow {...getToggleProps({onClick: handleOnClick}) }>
                <TColumn6 style={{display: "flex"}}>
                    {/* TODO: remove inline css*/}
                    <IconColumn1><AiFillStar style={{color: lightTheme.secondBackgroundColor, fontSize: "22px"}}/></IconColumn1>
                    <IconColumn1>
                        <SwapIconImageStyled src={row.original.token0Icon} width="45" height="45" />
                        <SwapIconTwoImageStyled src={row.original.token1Icon} width="45" height="45" />
                    </IconColumn1>
                    <PairTitleColumn>{row.original.token0Symbol} - {row.original.token1Symbol}</PairTitleColumn>
                    <TColumn2andHalf/>
                </TColumn6>
                <PairTitleColumn>
                    $ {convertNumber(parseFloat(row.original.totalSupply))}
                </PairTitleColumn>
                <TColumn3>$ {row.original.volume7d}</TColumn3>
                <TColumn3>$ {row.original.fees24h}</TColumn3>
                <TColumn3>{row.original.oneYFees} %</TColumn3>
                <TColumn1>{isExpanded ? <FiChevronUp /> : <FiChevronDown />}</TColumn1>
            </TRow>
            <TBodyExpanded {...getCollapseProps()}>
                <WrappedRow>
                    <TBodyColumn6>
                        <TRow style={{color: lightTheme.secondBackgroundColor}}>
                            <TColumn3 />
                            <TitleBodyRow>Assets Pooled</TitleBodyRow>
                            <TColumn2andHalf/>
                        </TRow>
                        <TRow>
                            <TColumn3/>
                            <NormalBodyRow>{convertNumber(parseFloat(row.original.reserve0))} {row.original.token0Symbol}</NormalBodyRow>
                            <TColumn2andHalf/>
                        </TRow>
                        <TRow>
                            <TColumn3 />
                            <NormalBodyRow>{convertNumber(parseFloat(row.original.reserve1))} {row.original.token1Symbol}</NormalBodyRow>
                            <TColumn2andHalf/>
                        </TRow>
                    </TBodyColumn6>
                    <TBodyColumn3>
                        <TRow style={{color: lightTheme.secondBackgroundColor}}>
                            <TitleBodyRow>Your Liquidity</TitleBodyRow>
                        </TRow>
                        <TRow>
                            <NormalBodyRow>$ {convertNumber(parseFloat(row.original.totalLiquidityUSD))}</NormalBodyRow>
                        </TRow>
                        <TRow>
                            <NormalBodyRow>{convertNumber(parseFloat(row.original.balance))} LP</NormalBodyRow>
                        </TRow>
                    </TBodyColumn3>
                    <TBodyColumn3>
                        <TRow style={{color: lightTheme.secondBackgroundColor}}>
                            <TitleBodyRow>Your Share</TitleBodyRow>
                        </TRow>
                        <TRow>
                            <NormalBodyRow>
                                {
                                    row.original.balance ?
                                    new BigNumber(row.original.balance).div(row.original.totalSupply).times(100).toFixed(2) : 0
                                } %
                            </NormalBodyRow>
                        </TRow>
                    </TBodyColumn3>
                    <TButtonColumn3>
                        <TRow>
                            <AddLiquidityButton enabled={true} onClick={() => {
                                goTo("/liquidity")
                            }}>Add Liquidity</AddLiquidityButton>
                        </TRow>
                    </TButtonColumn3>
                    <TBodyColumn3>
                        <TRow>
                            <CircleButton onClick={() => {goTo("/swap")}}>
                                {/* TODO: remove inline css*/}
                                <AiOutlineSwap style={{alignSelf: "center", transform: "rotate(90deg)", color: lightTheme.thirdBackgroundColor}} size="1.3rem" />
                            </CircleButton>
                            <CircleButton disabled={parseFloat(row.original.balance) <= 0} onClick={() => {goTo("/liquidity", true)}}>
                                <TbTrash style={{alignSelf: "center", color: lightTheme.thirdBackgroundColor}} size="1.3rem"/>
                            </CircleButton>
                            {false &&
                                <CircleButton onClick={() => {goTo("/farms")}}>
                                    {/* TODO: remove inline css*/}
                                    <NewIcons Icon={FarmIcon} style={{alignSelf: "center"}} size="22px" />
                                </CircleButton>
                            }
                        </TRow>
                    </TBodyColumn3>
                    <TColumn1 />
                </WrappedRow>
            </TBodyExpanded>
        </TWrapRow> :
        <TWrapCardRow className="collapsible" {...row.getRowProps()} >
            <TFirstRow {...getToggleProps({onClick: handleOnClick}) }>
                <TColumn6 style={{display: "flex"}}>
                    {/* TODO: remove inline css*/}
                    <IconColumn1><AiFillStar style={{color: lightTheme.secondBackgroundColor, fontSize: "22px"}}/></IconColumn1>
                    <IconColumn1>
                        <SwapIconImageStyled src={row.original.token0Icon} width="45" height="45" />
                        <SwapIconTwoImageStyled src={row.original.token1Icon} width="45" height="45" />
                    </IconColumn1>
                    <PairTitleColumn>{row.original.token0Symbol} - {row.original.token1Symbol}</PairTitleColumn>
                    <TColumn2andHalf/>
                </TColumn6>
                <TColumn1>{isExpanded ? <FiChevronUp style={{color: lightTheme.secondBackgroundColor, fontSize: "22px"}}/> : <FiChevronDown style={{color: lightTheme.secondBackgroundColor, fontSize: "22px"}} />}</TColumn1>
            </TFirstRow>
            <TSecondRow {...getCollapseProps()}>
                <WrappedRow>
                    <TRow>
                        <TitleBodyRow>Assets Pooled</TitleBodyRow>
                        <NormalBodyRow>{convertNumber(parseFloat(row.original.reserve0))} {row.original.token0Symbol} | {convertNumber(parseFloat(row.original.reserve1))} {row.original.token1Symbol}</NormalBodyRow>
                    </TRow>
                    <TRow>
                        <TitleBodyRow>Your Liquidity</TitleBodyRow>
                        <NormalBodyRow>$ {convertNumber(parseFloat(row.original.totalLiquidityUSD))} | {convertNumber(parseFloat(row.original.balance))} LP</NormalBodyRow>
                    </TRow>
                    <TRow>
                        <TitleBodyRow>Your Share</TitleBodyRow>
                        <NormalBodyRow>
                            {
                                row.original.balance ? new BigNumber(row.original.balance).div(row.original.totalSupply).times(100).toFixed(2) : 0
                            } %
                        </NormalBodyRow>
                    </TRow>
                    <TLeftRow>
                        <AddLiquidityButton enabled={true} onClick={() => {
                            goTo("/liquidity")
                        }}>Add Liquidity</AddLiquidityButton>
                    </TLeftRow>
                    <TLeftRow>
                        <CircleButton onClick={() => {goTo("/swap")}}>
                            {/* TODO: remove inline css*/}
                            <AiOutlineSwap style={{alignSelf: "center", transform: "rotate(90deg)", color: lightTheme.thirdBackgroundColor}} size="1.3rem" />
                        </CircleButton>
                        <CircleButton disabled={parseFloat(row.original.balance) <= 0} onClick={() => {goTo("/liquidity", true)}}>
                            <TbTrash style={{alignSelf: "center", color: lightTheme.thirdBackgroundColor}} size="1.3rem"/>
                        </CircleButton>
                        {false &&
                          <CircleButton onClick={() => {goTo("/farms")}}>
                              {/* TODO: remove inline css*/}
                              <NewIcons Icon={FarmIcon} style={{alignSelf: "center"}} size="22px" />
                          </CircleButton>
                        }
                    </TLeftRow>
                </WrappedRow>
            </TSecondRow>
            <TThirdRow>
                <TLeftRow>
                    <TitleStyled>Liquidity </TitleStyled>
                    <ValueStyled>$ {convertNumber(parseFloat(row.original.totalSupply))}</ValueStyled>
                </TLeftRow>
                <TLeftRow>
                    <TitleStyled>Volume 7D</TitleStyled>
                    <ValueStyled>$ {row.original.volume7d}</ValueStyled>
                </TLeftRow>
                <TLeftRow>
                    <TitleStyled>Fees 7D</TitleStyled>
                    <ValueStyled>$ {row.original.fees24h}</ValueStyled>
                </TLeftRow>
                <TLeftRow>
                    <TitleStyled>APR 7D</TitleStyled>
                    <ValueStyled>{row.original.oneYFees} %</ValueStyled>
                </TLeftRow>
            </TThirdRow>
        </TWrapCardRow>
    )
}
