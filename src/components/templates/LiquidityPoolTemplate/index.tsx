import { SingleColumn } from "../../../layout/SingleColumn";
import { PoolTable, LPSearch } from "rengo-ui-kit";
import usdcTokenIcon from '../../../assets/swapIcons/btc.png'
import { Container, SubHeader } from "./styles";
import { useTheme } from "styled-components";
import { PairsContextProvider } from "../../../contexts/PairsContext";
import { useContext } from "react";
import { convertNumber } from "../../../contexts/ConfigContext";
import BigNumber from "bignumber.js";

export const POOL_TABLE_DATA = [
    {
      id: 1,
      token1Icon: usdcTokenIcon,
      token2Icon: usdcTokenIcon,
      pool: 'WETH-CSPR',
      liquidity: '4,653,213',
      volumen7d: '4,653,213',
      fees7d: '4,653,213',
      apr: '4,653,213',
    },
    {
      id: 2,
      token1Icon: usdcTokenIcon,
      token2Icon: usdcTokenIcon,
      pool: 'WETH-CSPR',
      liquidity: '4,653,213',
      volumen7d: '4,453,213',
      fees7d: '4,053,213',
      apr: '4,653,213',
    },
    {
      id: 3,
      token1Icon: usdcTokenIcon,
      token2Icon: usdcTokenIcon,
      pool: 'WETH-CSPR',
      liquidity: '4,653,213',
      volumen7d: '4,153,213',
      fees7d: '4,853,213',
      apr: '4,653,213',
    },
  ]

export const LiquidityPoolTemplate = ({ isMobile }) => {
  const theme = useTheme();
  const {getPoolList, pairState} = useContext(PairsContextProvider)
  const data = getPoolList()

  const handleOnlyShowStaked = (showStaked:boolean) => {
      console.log('handleOnlyShowStaked', showStaked)
  }

  const finalData = data.map(item => (
     {
      pool: `${item.token0Symbol} - ${item.token1Symbol}`,
      token0Icon: item.token0Icon,
      token1Icon: item.token1Icon,
      liquidity: `$ ${convertNumber(parseFloat(item.totalLiquidityUSD))}`,
      volume7d: `$ ${item.volume7d}`,
      fees7d: `$ ${new BigNumber(item.volume7d).times(0.003).toFixed(2)}`,
      apr: '0 %'
    }
  ))
  console.log('check finalData ', finalData);

  return (
    <div>
      <SingleColumn isMobile={isMobile} title="Liquidity Pool">
        <Container isMobile={isMobile}>
          <SubHeader theme={theme}>Earn yield on trading by providing liquidity</SubHeader >
          <LPSearch handleOnlyShowStaked={handleOnlyShowStaked}/>
          <PoolTable data={finalData}/>
        </Container>
      </SingleColumn>
    </div>
  );
};
