import React, {useContext} from 'react'
import { CardContainer } from '../../atoms'
import { PoolModule } from '../../organisms'
import NewLayout from "../../../layout/NewLayout";
import {
  WrappedPool,
  WrappedPoolTitle,
  TitleBox,
  WrappedHeaderPool,
  HeaderPool,
  TitleBoxWrapper
} from "./styles";
import { convertNumber } from "../../../contexts/ConfigContext";
import { POCSearch3 } from "../../POCSearch3";
import {PoolProviderContext} from "../../../contexts/PoolContext";
import {PairsContextProvider} from "../../../contexts/PairsContext";

export const Pools = () => {
  const {
    poolColumns,
    tableInstance,
    setCurrentQuery,
    getTVLandVolume
  } = React.useContext(PoolProviderContext)

  const {getPoolList, pairState} = useContext(PairsContextProvider)

  const TVLAndVolume = getTVLandVolume(pairState)

  return (
    <NewLayout title="CASPERSWAP">
      <WrappedPool>
        <WrappedHeaderPool>
          <HeaderPool>Liquidity Pools</HeaderPool>
          <WrappedPoolTitle>
            {
              tableInstance &&
              <POCSearch3 tableInstance={tableInstance} setQuery={setCurrentQuery} />
            }
            <TitleBoxWrapper><TitleBox>TVL: ${convertNumber(parseFloat(TVLAndVolume.tvl))}</TitleBox></TitleBoxWrapper>
            <TitleBoxWrapper><TitleBox>VOLUME 7D: ${convertNumber(parseFloat(TVLAndVolume.totalVolume))}</TitleBox></TitleBoxWrapper>
          </WrappedPoolTitle>
        </WrappedHeaderPool>
        <CardContainer gridRow="2" gridColumn="1/11" cardTitle="Liquidity Pools" width="85%">
          <PoolModule columns={poolColumns} data={getPoolList(pairState)} />
        </CardContainer >
      </WrappedPool>
    </NewLayout>
  )
}
