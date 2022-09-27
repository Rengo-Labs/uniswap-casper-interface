import React, {useState} from 'react';
import useCollapse from 'react-collapsed';

import {AiOutlineSwap} from "react-icons/ai";
import {Button} from '../../atoms'
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
import {TiTrash} from "react-icons/all";
import {SwapIconImageStyled} from "../SwapToken/styles";


export const CollapsingRow = ({row, fullExpanded = false}:any)  => {
    const [ isExpanded, setExpanded ] = useState(fullExpanded);
    const navigate = useNavigate()

    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

    const handleOnClick = () => {
        setExpanded(!isExpanded);
    }

    return (
        <TWrapRow className="collapsible" {...row.getRowProps()} >
            <TRow {...getToggleProps({onClick: handleOnClick}) }>
                <TColumn6 style={{display: "flex"}}>
                    <TColumn1 />
                    <TColumn3>
                        <SwapIconImageStyled src={row.original.tokeIcon1} width="30" height="30" />
                        <SwapIconImageStyled style={{position: "relative", left: "-12px"}} src={row.original.tokeIcon2} width="30" height="30" />
                    </TColumn3>
                    <div style={{flex: "3", alignSelf: "center", textAlign: "left"}}>{row.original.tokeName}</div>
                </TColumn6>
                <TColumn3 style={{display: "flex"}}>
                    <TColumn1 />
                    <TColumn3 style={{textAlign: "left"}}>
                        $ {row.original.tokenLiquidity}
                    </TColumn3>
                </TColumn3>
                <TColumn3>$ {row.original.volume7d}</TColumn3>
                <TColumn3>$ {row.original.fees24h}</TColumn3>
                <TColumn3>% {row.original.oneYFees}</TColumn3>
                <TColumn1>{isExpanded ? <TiArrowSortedUp /> : <TiArrowSortedDown />}</TColumn1>
            </TRow>
            <TBodyExpanded {...getCollapseProps()}>
                <WrappedRow>
                    <TColumn6>
                        <TRow style={{color: "#7864f4"}}>
                            <TColumn1 />
                            <TColumn3 />
                            <TColumn3 style={{textAlign: "left"}}>Your Liquidity</TColumn3>
                        </TRow>
                        <TRow>
                            <TColumn1 />
                            <TColumn3 />
                            <TColumn3 style={{textAlign: "left"}}>$ {row.original.pair.totalLiquidityUSD}</TColumn3>
                        </TRow>
                        <TRow>
                            <TColumn1 />
                            <TColumn3 />
                            <TColumn3 style={{textAlign: "left"}}>{row.original.pair.totalLiquidityPool} LP</TColumn3>
                        </TRow>
                    </TColumn6>
                    <TColumn3>
                        <TRow style={{color: "#7864f4"}}>
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
                        <TRow style={{color: "#7864f4"}}>
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>
                                Your Share
                            </TColumn3>
                        </TRow>
                        <TRow>
                            <TColumn1 />
                            <TColumn3 style={{textAlign: "left"}}>
                                {row.original.pair.volumePercentage} %
                            </TColumn3>
                        </TRow>
                    </TColumn3>
                    <TColumn3>
                        <TRow>
                            <Button content={'Add Liquidity'} handler={() => {
                                navigate({pathname: "/liquidity/add", search: `token0=${row.original.pair.token0}&token1=${row.original.pair.token1}`})
                            }}/>
                        </TRow>
                    </TColumn3>
                    <TColumn3>
                        <TRow>
                            <CircleButton><AiOutlineSwap style={{alignSelf: "center", transform: "rotate(90deg)"}} size="1.3rem" /></CircleButton>
                            <CircleButton><TiTrash style={{alignSelf: "center"}} size="1.3rem" /></CircleButton>
                            <CircleButton><TiTrash style={{alignSelf: "center"}} size="1.3rem" /></CircleButton>
                        </TRow>
                    </TColumn3>
                    <TColumn1 />
                </WrappedRow>
            </TBodyExpanded>
        </TWrapRow>
    );
}
