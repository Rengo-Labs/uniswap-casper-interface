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
import { LiquidityProviderContext } from "../../../contexts/LiquidityContext";

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

const poolDetailsRowDefault = {
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
};

export const LiquidityPoolTemplate = ({ isMobile }) => {
  const theme = useTheme();
  const { getPoolList, pairState } = useContext(PairsContextProvider);
  const { refresh } = useContext(StateHashProviderContext);
  const { progressBar, clearProgress, getProgress } = useContext(
    ProgressBarProviderContext
  );
  const { setRemovingPopup } = useContext(LiquidityProviderContext);

  const navigate = useNavigate();
  const [showpoolDetails, setShowPoolDetails] = useState<boolean>(false);
  const [showStakedOnlyOnTable, setShowStakedOnlyOnTable] =
    useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [poolDetailRow, setPoolDetailRow] = useState<IPoolDetailRow>(
    poolDetailsRowDefault
  );
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    setTableData(
      getPoolList().map((item) => ({
        name: item.name,
        pool: `${item.token0Symbol} - ${item.token1Symbol}`,
        token0Icon: item.token0Icon,
        token1Icon: item.token1Icon,
        liquidity: convertNumber(parseFloat(item.totalLiquidityUSD)),
        volume7d: Number(item.volume7dUSD) || 0,
        fees7d: Number(new BigNumber(item.volume7d).times(0.003).toFixed(2)),
        apr: 0,
        balance: item.balance,
        isFavorite: getLocalStorageData("pool")?.includes(item.name),
      }))
    );
  }, [pairState]);

  const handleShowPoolDetails = () => {
    setPoolDetailRow(poolDetailsRowDefault);
    setShowPoolDetails((prev) => !prev);
  };

  const goTo = (path: string, pool: string) => {
    const tokens = pool.split("-");
    navigate({
      pathname: path,
      search: `token0=${tokens[0].trim()}&token1=${tokens[1].trim()}`,
    });
  };

  const handleTrash = (name) => {
    const pair = pairState[name];
    navigate({
      pathname: "/liquidity",
      search: `token0=${pair.token0Symbol}&token1=${pair.token1Symbol}`,
    });
    setRemovingPopup(true);
  };


  const handleView = (name: string) => {
    const newRow = getPoolList().filter((item) => item.name === name)[0];
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
      yourShare: (Number(newRow.balance) / Number(newRow.totalSupply)).toFixed(
        2
      ),
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

  const updateTableData = (name: string, isFavorite: boolean) => {
    const newTableData = tableData.map((item) => {
      if (item.name === name) {
        return {
          ...item,
          isFavorite: !isFavorite,
        };
      }
      return item;
    });

    setTableData(newTableData);
  };

  const updateLocalStorage = (
    name: string,
    currentPersistedData: string[],
    isFavorite: boolean
  ) => {
    const newLocalStorageData = isFavorite
      ? currentPersistedData.filter((item) => item !== name)
      : [...currentPersistedData, name];
    setLocalStorageData("pool", newLocalStorageData);
  };

  const handleFavorite = (name: string) => {
    const currentPersistedData: string[] = getLocalStorageData("pool");
    const isPresent = currentPersistedData.includes(name);

    updateTableData(name, isPresent);
    setPoolDetailRow({ ...poolDetailRow, isFavorite: !isPresent });

    updateLocalStorage(name, currentPersistedData, isPresent);
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
            clearProgress={async () => refresh()}
          />

          <PoolTable
            data={tableData}
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
