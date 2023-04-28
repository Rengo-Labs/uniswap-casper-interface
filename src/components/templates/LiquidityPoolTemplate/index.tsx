import { SingleColumn } from "../../../layout/SingleColumn";
import { PoolTable, LPSearch } from "rengo-ui-kit";
import usdcTokenIcon from "../../../assets/swapIcons/btc.png";
import { Container, SubHeader } from "./styles";
import { useTheme } from "styled-components";
import { PairsContextProvider } from "../../../contexts/PairsContext";
import { ProgressBarProviderContext } from "../../../contexts/ProgressBarContext";
import { useContext, useEffect, useState } from "react";
import { convertNumber } from "../../../contexts/ConfigContext";
import BigNumber from "bignumber.js";
import { useNavigate } from "react-router-dom";
import { StateHashProviderContext } from "../../../contexts/StateHashContext";

export const LiquidityPoolTemplate = ({ isMobile }) => {
  const theme = useTheme();
  const { getPoolList } = useContext(PairsContextProvider);
  const {refresh} = useContext(StateHashProviderContext)
  const { 
    progressBar,
    clearProgress,
    getProgress } = useContext(ProgressBarProviderContext);

  const data = getPoolList();
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");
  const [showStakedOnlyOnTable, setShowStakedOnlyOnTable] = useState<boolean>(false)

  const finalData = data.map((item) => ({
    pool: `${item.token0Symbol} - ${item.token1Symbol}`,
    token0Icon: item.token0Icon,
    token1Icon: item.token1Icon,
    liquidity: convertNumber(parseFloat(item.totalLiquidityUSD)),
    volume7d: item.volume7dUSD || "0",
    fees7d: `${new BigNumber(item.volume7d).times(0.003).toFixed(2)}`,
    apr: "0 %",
    balance: item.balance
  }));

  const goTo = (path: string, pool: string) => {
    const tokens = pool.split("-");
    navigate({
      pathname: path,
      search: `token0=${tokens[0].trim()}&token1=${tokens[1].trim()}`,
    });
  };

  const handleTrash = () => {};
  const handleView = () => {};

  useEffect(() => {
    progressBar(async () => {
      await refresh()
    })
  
    return () => {
      progressBar(async () => {
        await refresh()
      })
    }
  }, [])
  
  return (
    <div>
      <SingleColumn isMobile={isMobile} title="Liquidity Pool">
        <Container isMobile={isMobile}>
          <SubHeader theme={theme}>
            Earn yield on trading by providing liquidity
          </SubHeader>
          
          <LPSearch
            handleOnlyShowStaked={setShowStakedOnlyOnTable}
            handleSearch={setQuery}
            handleReloadButton={async () => clearProgress()}
            getProgress={() => getProgress}
            clearProgress={() => console.log('clear progress pending')} />

          <PoolTable
            data={finalData}
            handleSwap={goTo}
            handleAddLiquidity={goTo}
            handleTrash={handleTrash}
            handleView={handleView}
            query={query}
            showStakedOnly={showStakedOnlyOnTable}
          />
        </Container>
      </SingleColumn>
    </div>
  );
};
