import { SingleColumn } from "../../../layout/SingleColumn";
import { PoolTable, LPSearch, PoolItemDetails } from "rengo-ui-kit";
import usdcTokenIcon from "../../../assets/swapIcons/btc.png";
import { Container, SubHeader } from "./styles";
import { useTheme } from "styled-components";
import { PairsContextProvider } from "../../../contexts/PairsContext";
import { ProgressBarProviderContext } from "../../../contexts/ProgressBarContext";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { convertNumber } from "../../../contexts/ConfigContext";
import BigNumber from "bignumber.js";
import { useNavigate } from "react-router-dom";
import { StateHashProviderContext } from "../../../contexts/StateHashContext";
import {
  getLocalStorageData,
  setLocalStorageData,
} from "../../../commons/utils/persistData";

interface IPoolDetailRow {
  token0Icon?: string;
  token1Icon?: string;
  token0Symbol?: string;
  token1Symbol?: string;
  yourLiquidity: string;
  assetsPooled: {
    asset0: string;
    asset1: string;
  };
  yourShare: any;
  liqudiity: string;
  volume7D: string;
  fees7D: string;
  apr: string;
  isFavorite?: boolean;
}

export const LiquidityPoolTemplate = ({ isMobile }) => {
  const theme = useTheme();
  const { getPoolList } = useContext(PairsContextProvider);
  const { refresh } = useContext(StateHashProviderContext);
  const { progressBar, clearProgress, getProgress } = useContext(
    ProgressBarProviderContext
  );

  const data = getPoolList();
  const navigate = useNavigate();
  const [showpoolDetails, setShowPoolDetails] = useState<boolean>(false);
  const [showStakedOnlyOnTable, setShowStakedOnlyOnTable] =
    useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [poolDetailRow, setPoolDetailRow] = useState<IPoolDetailRow>({
    token0Icon: "",
    token1Icon: "",
    token0Symbol: "",
    token1Symbol: "",
    yourLiquidity: "",
    assetsPooled: {
      asset0: "",
      asset1: "",
    },
    yourShare: "",
    liqudiity: "",
    volume7D: "",
    fees7D: "",
    apr: "",
    isFavorite: false,
  });
  const [finalData, setFinalData] = useState<any[]>(
    data.map((item) => ({
      name: item.name,
      pool: `${item.token0Symbol} - ${item.token1Symbol}`,
      token0Icon: item.token0Icon,
      token1Icon: item.token1Icon,
      liquidity: convertNumber(parseFloat(item.totalLiquidityUSD)),
      volume7d: item.volume7dUSD || "0",
      fees7d: `${new BigNumber(item.volume7d).times(0.003).toFixed(2)}`,
      apr: "0",
      balance: item.balance,
      isFavorite: getLocalStorageData("pool")?.includes(item.name),
    }))
  );

  const handleShowPoolDetails = () => {
    setShowPoolDetails(false);
  };

  // const finalData = data.map((item) => ({
  //   name: item.name,
  //   pool: `${item.token0Symbol} - ${item.token1Symbol}`,
  //   token0Icon: item.token0Icon,
  //   token1Icon: item.token1Icon,
  //   liquidity: convertNumber(parseFloat(item.totalLiquidityUSD)),
  //   volume7d: item.volume7dUSD || "0",
  //   fees7d: `${new BigNumber(item.volume7d).times(0.003).toFixed(2)}`,
  //   apr: "0",
  //   balance: item.balance,
  //   isFavorite: getLocalStorageData('pool')?.includes(item.name)
  // }));

  const goTo = (path: string, pool: string) => {
    const tokens = pool.split("-");
    navigate({
      pathname: path,
      search: `token0=${tokens[0].trim()}&token1=${tokens[1].trim()}`,
    });
  };

  const handleTrash = () => {};
  const handleView = (name: string) => {
    const newRow = data.filter((item) => item.name === name)[0];
    setPoolDetailRow({
      token0Icon: newRow.token0Icon,
      token1Icon: newRow.token1Icon,
      token0Symbol: newRow.token0Symbol,
      token1Symbol: newRow.token1Symbol,
      yourLiquidity: `${newRow.balance} CSPR`,
      assetsPooled: {
        asset0: `${newRow.reserve0} ${newRow.token0Symbol}`,
        asset1: `${newRow.reserve1} ${newRow.token1Symbol}`,
      },
      yourShare: Number(newRow.balance) / Number(newRow.totalSupply) + "%",
      liqudiity: convertNumber(parseFloat(newRow.totalLiquidityUSD)),
      volume7D: newRow.volume7dUSD || "0",
      fees7D: `${new BigNumber(newRow.volume7d).times(0.003).toFixed(2)}`,
      apr: "0",
      isFavorite: getLocalStorageData("pool")?.includes(name),
    });
    setShowPoolDetails(true);
  };

  useEffect(() => {
    progressBar(async () => {
      await refresh();
    });

    return () => {
      progressBar(async () => {
        await refresh();
      });
    };
  }, []);

  const uppdateFinalData = (name: string, isFavorite: boolean) => {
    setFinalData((prev) => {
      const newFinalData = prev.map((item) => {
        if (item.name === name) {
          return { ...item, isFavorite };
        }
        return item;
      });
      return newFinalData;
    });
  };

  const handleFavorite = (name: string) => {
    const prevData: string[] = getLocalStorageData("pool");

    if (prevData?.includes(name)) {
      const newData = prevData.filter((item) => item !== name);
      setLocalStorageData("pool", newData);
      setPoolDetailRow((prev) => ({ ...prev, isFavorite: false }));
      uppdateFinalData(name, false);
      return;
    }
    setLocalStorageData("pool", prevData ? [...prevData, name] : [name]);
    setPoolDetailRow((prev) => ({ ...prev, isFavorite: true }));
    uppdateFinalData(name, true);
  };

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
            clearProgress={() => console.log("clear progress pending")}
          />

          <PoolTable
            data={finalData}
            handleSwap={goTo}
            handleAddLiquidity={goTo}
            handleTrash={handleTrash}
            handleView={handleView}
            showStakedOnly={showStakedOnlyOnTable}
            handleFavorite={handleFavorite}
            query={query}
          />
          <PoolItemDetails
            isOpen={showpoolDetails}
            closeCallback={handleShowPoolDetails}
            token0Icon={poolDetailRow.token0Icon}
            token1Icon={poolDetailRow.token1Icon}
            token0Symbol={poolDetailRow.token0Symbol}
            token1Symbol={poolDetailRow.token1Symbol}
            isFavorite={poolDetailRow.isFavorite}
            handleFavorite={() =>
              handleFavorite(
                `${poolDetailRow.token1Symbol}-${poolDetailRow.token0Symbol}`
              )
            }
            widthIcon={45}
            heightIcon={45}
            yourLiquidity={poolDetailRow.yourLiquidity}
            assetsPooled={poolDetailRow.assetsPooled}
            yourShare={poolDetailRow.yourShare}
            liqudiity={poolDetailRow.liqudiity}
            volume7D={poolDetailRow.volume7D}
            fees7D={poolDetailRow.fees7D}
            apr={poolDetailRow.apr}
          />
        </Container>
      </SingleColumn>
    </div>
  );
};
