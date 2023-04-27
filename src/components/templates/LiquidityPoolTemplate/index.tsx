import { SingleColumn } from "../../../layout/SingleColumn";
import { PoolTable, LPSearch } from "rengo-ui-kit";
import usdcTokenIcon from '../../../assets/swapIcons/btc.png'
import { Container, SubHeader } from "./styles";
import { useTheme } from "styled-components";

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

    const handleOnlyShowStaked = (showStaked:boolean) => {
        console.log('handleOnlyShowStaked', showStaked)
    }
  return (
    <div>
      <SingleColumn isMobile={isMobile} title="Liquidity Pool">
        <Container isMobile={isMobile}>
          <SubHeader theme={theme}>Earn yield on trading by providing liquidity</SubHeader >
          <LPSearch handleOnlyShowStaked={handleOnlyShowStaked}/>
          <PoolTable data={POOL_TABLE_DATA}/>
        </Container>
      </SingleColumn>
    </div>
  );
};
