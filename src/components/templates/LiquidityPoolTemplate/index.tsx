import { SingleColumn } from "../../../layout/SingleColumn";
import { PoolTable, LPSearch, PoolItemDetails, RemoveLiquidityDialog } from "rengo-ui-kit";
import { Container, SubHeader } from "./styles";
import { useTheme } from "styled-components";
import { PairsContextProvider } from "../../../contexts/PairsContext";
import { ProgressBarProviderContext } from "../../../contexts/ProgressBarContext";
import { useContext, useEffect, useState } from "react";
import { ConfigProviderContext } from "../../../contexts/ConfigContext";
import BigNumber from "bignumber.js";
import { useNavigate } from "react-router-dom";
import { StateHashProviderContext } from "../../../contexts/StateHashContext";
import {
  getLocalStorageData,
  setLocalStorageData,
} from "../../../commons/utils/persistData";
import { LiquidityProviderContext } from "../../../contexts/LiquidityContext";
import wcsprIcon from "../../../assets/swapIcons/wrappedCasperIcon.png";
import csprIcon from "../../../assets/swapIcons/casperIcon.png";
import { TokensProviderContext } from "../../../contexts/TokensContext";
import {SUPPORTED_NETWORKS} from "../../../constant";
import { convertToUSDCurrency } from "../../../commons/utils";

interface IPoolDetailRow {
  contractPackage: string,
  token0Icon?: string;
  token1Icon?: string;
  token0Symbol?: string;
  token1Symbol?: string;
  yourLiquidityTokens: string;
  assetsPooled: {
    asset0: string;
    asset1: string;
  };
  yourShare: any;
  yourLiquidity: string;
  volume7D: string;
  fees7D: string;
  isFavorite?: boolean;
  yourStaked: string;
  stakedPercentage: string;
  yourAPR: string;
}

const poolDetailsRowDefault = {
  contractPackage: "",
  token0Icon: "",
  token1Icon: "",
  token0Symbol: "",
  token1Symbol: "",
  yourLiquidityTokens: "",
  assetsPooled: {
    asset0: "",
    asset1: "",
  },
  yourShare: "",
  yourLiquidity: "",
  volume7D: "",
  fees7D: "",
  isFavorite: false,
  yourStaked: "0",
  stakedPercentage: "0.00 %",
  yourAPR: "0.00 %"
};

export const LiquidityPoolTemplate = ({ isMobile }) => {
  const theme = useTheme();
  const { getPoolList, pairState } = useContext(PairsContextProvider);
  const { refresh } = useContext(StateHashProviderContext);
  const { progressBar, clearProgress, getProgress } = useContext(
    ProgressBarProviderContext
  );
  const {
    setRemovingPopup,
    onRemoveLiquidity} = useContext(LiquidityProviderContext)

  const {
      tokenState
    } = useContext(TokensProviderContext)

  const {
    onIncreaseAllow,
    gasPriceSelectedForLiquidity,
    } = useContext(ConfigProviderContext)

  const navigate = useNavigate();
  const [showpoolDetails, setShowPoolDetails] = useState<boolean>(false);
  const [showStakedOnlyOnTable, setShowStakedOnlyOnTable] =
    useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [poolDetailRow, setPoolDetailRow] = useState<IPoolDetailRow>(
    poolDetailsRowDefault
  );
  const [tableData, setTableData] = useState<any[]>([]);
  const [showRemoveLiquidityDialog, setShowRemoveLiquidityDialog] = useState<boolean>(false)
  const [removeLiquidityInput, setRemoveLiquidityInput] = useState(0)
  const [removeLiquidityData, setRemoveLiquidityData] = useState({
    id: 'd3jd92d',
    tokenName: 'CSPR',
    liquidity: '0',
    allowance: 0,
    firstIcon: '',
    firstName: 'CSPR',
    firstSymbol: 'CSPR',
    firstLiquidity: '0',
    firstRate: '0',
    firstHash: '',
    firstDecimals: 9,
    decimals: 9,
    secondIcon: '',
    secondName: 'WETH',
    secondSymbol: 'WETH',
    secondLiquidity: '0',
    secondRate: '0',
    secondHash: '',
    secondDecimals: 9
  })
  const [removeLiquidityCalculation, setRemoveLiquidityCalculation] = useState<any>({
    lpAmount: 0,
    firstAmount: 0,
    secondAmount: 0,
    allowance: 0
  })
  const [removeLiquidityToggle, setRemoveLiquidityToggle] = useState(true)
  const [gasFee, gasFeeSetter] = useState<number>(gasPriceSelectedForLiquidity)
  const [removeLiquidityButtonDisabled, setRemoveLiquidityButtonDisabled] = useState(true)
  const [showRemovingToggle, setShowRemovingToggle] = useState(true)
  const [removeLiquidityAllowanceEnabled, setRemoveLiquidityAllowanceEnabled] = useState(false)

  useEffect(() => {
    setTableData(
      getPoolList().map((item) => {
        const combinedBalance = new BigNumber(item.balance || 0).plus(item.gaugeBalance || 0)

        const ratio = combinedBalance.div(item.totalSupply)
        return {
          contractPackage: item.packageHash.slice(5),
          name: item.name,
          pool: `${item.token0Symbol} - ${item.token1Symbol}`,
          token0Icon: item.token0Icon,
          token1Icon: item.token1Icon,
          yourLiquidity: ratio.times(item.totalLiquidityUSD).isNaN() ? '$0.00':convertToUSDCurrency(ratio.times(item.totalLiquidityUSD).toNumber()),
          volume7d: convertToUSDCurrency(isNaN(item.volume7d) ? 0 : Number(item.volume7d)),
          fees7d: convertToUSDCurrency(isNaN(item.volume7d) ? 0 : Number(new BigNumber(item.volume7d).times(0.003).toFixed(2))),
          balance: combinedBalance.isNaN() ? '0' : combinedBalance.toFixed(item.decimals),
          isFavorite: getLocalStorageData("pool")?.includes(item.name),
          assetsPoolToken0: `${isNaN(item.totalReserve0) ? 0 : item.totalReserve0} ${item.token0Symbol}`,
          assetsPoolToken1: `${isNaN(item.totalReserve1) ? 0 : item.totalReserve1} ${item.token1Symbol}`,
          yourShare: `${(ratio.toNumber() * 100).toFixed(2)}`,
          apr: item.apr,
        }
      })
    );

  }, [pairState]);

  useEffect(() => {
    if (showRemoveLiquidityDialog) {
        const pair = pairState[removeLiquidityData.tokenName]

        setRemoveLiquidityData((prevState) => ({
            ...prevState,
            allowance: parseFloat(pair.allowance)
        }))

        setRemoveLiquidityCalculation((prevState) => ({
            ...prevState,
            allowance: removeLiquidityCalculation.lpAmount - parseFloat(pair.allowance)
        }))
    }

  }, [tokenState])

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

  const createRemovingDataForPopup = (itemName) => {
    setRemoveLiquidityToggle(true)
    const pairRemoteData = getPoolList().find(element => element.name === itemName)
    const token0 = tokenState.tokens[pairRemoteData.token0Symbol]
    const token1 = tokenState.tokens[pairRemoteData.token1Symbol]

    const tokenActive = token0.symbolPair === 'WCSPR' || token0.symbolPair === 'CSPR'
      || token1.symbolPair === 'WCSPR' || token1.symbolPair === 'CSPR'
    setShowRemovingToggle(tokenActive)

    const data = {
        id: pairRemoteData.contractHash,
        tokenName: pairRemoteData.name,
        liquidity: pairRemoteData.balance,
        allowance: parseFloat(pairRemoteData.allowance),
        firstIcon: pairRemoteData.token0Symbol === 'CSPR' ? csprIcon : pairRemoteData.token0Icon,
        firstName: pairRemoteData.token0Symbol === 'CSPR' ? 'Casper' : pairRemoteData.token0Name,
        firstSymbol: pairRemoteData.token0Symbol,
        firstLiquidity: pairRemoteData.reserve0,
        firstRate: new BigNumber(pairRemoteData.reserve0).div(pairRemoteData.reserve1).toFixed(token0.decimals),
        firstHash: pairRemoteData.contract0,
        firstDecimals: token0.decimals,
        secondIcon: pairRemoteData.token1Symbol === 'CSPR' ? csprIcon : pairRemoteData.token1Icon,
        secondName: pairRemoteData.token1Symbol === 'CSPR' ? 'Casper' : pairRemoteData.token1Name,
        secondSymbol: pairRemoteData.token1Symbol,
        secondLiquidity: pairRemoteData.reserve1,
        secondRate: new BigNumber(pairRemoteData.reserve1).div(pairRemoteData.reserve0).toFixed(token1.decimals),
        secondHash: pairRemoteData.contract1,
        decimals: pairRemoteData.decimals,
        secondDecimals: token1.decimals
    }

    setRemoveLiquidityData((prevState) => ({
        ...prevState,
        ...data
    }))

    setRemoveLiquidityCalculation((prevState => ({...prevState, lpAmount: 0, firstAmount: 0, secondAmount: 0, allowance: parseFloat(pairRemoteData.liquidity) - parseFloat(pairRemoteData.allowance)})))
    setShowRemoveLiquidityDialog(true)
  }

  const onActionAllowance = async () => {
    await onIncreaseAllow(removeLiquidityCalculation.allowance, removeLiquidityData.id, removeLiquidityData.decimals,
      "", null, `${removeLiquidityData.firstSymbol}-${removeLiquidityData.secondSymbol}`, true, false)
    setRemoveLiquidityAllowanceEnabled(false)
  }

  const handleRemoveLiquidity =  () => {
    setRemoveLiquidityButtonDisabled(true)
    setRemoveLiquidityInput(0)
    setRemovingPopup(false)
    setShowRemoveLiquidityDialog(false)
  }

  const handleChangeInput = (value) => {
    if (value === 0) {
      setRemoveLiquidityButtonDisabled(true)
    }

    if (value > 0 && removeLiquidityButtonDisabled) {
      setRemoveLiquidityButtonDisabled(false)
    }

    setRemoveLiquidityInput(value)
    handleRemoveCalculation(value)
  }

  const handleRemoveCalculation = (value) => {
    const inputPercent = new BigNumber(value).dividedBy(100)

    const lpAmount = new BigNumber(removeLiquidityData.liquidity).multipliedBy(inputPercent)
    const firstAmount = new BigNumber(removeLiquidityData.firstLiquidity).multipliedBy(inputPercent)
    const secondAmount = new BigNumber(removeLiquidityData.secondLiquidity).multipliedBy(inputPercent)
    const newVar = (prevState) => ({
        ...prevState,
        lpAmount: lpAmount.toNumber().toFixed(removeLiquidityData.decimals),
        firstAmount: firstAmount.toNumber().toFixed(removeLiquidityData.decimals),
        secondAmount: secondAmount.toNumber().toFixed(removeLiquidityData.decimals),
        allowance: lpAmount.toNumber() - removeLiquidityData.allowance
    });

    setRemoveLiquidityCalculation(newVar)
  }

  const handleRemoveLiquidityToggle = (e) => {

    if (removeLiquidityData.firstSymbol.includes('CSPR')) {
        setRemoveLiquidityData(prevState => ({
            ...prevState,
            firstIcon: e ? csprIcon : wcsprIcon,
            firstSymbol: e ? 'CSPR' : 'WCSPR',
            firstName: e ? 'Casper' : 'Wrapped Casper'
        }))
    } else {
        setRemoveLiquidityData(prevState => ({
            ...prevState,
            secondIcon: e ? csprIcon : wcsprIcon,
            secondSymbol: e ? 'CSPR' : 'WCSPR',
            secondName: e ? 'Casper' : 'Wrapped Casper'
        }))
    }
    setRemoveLiquidityToggle(e)
}

const handleActionRemoval = async () => {
  setRemoveLiquidityButtonDisabled(true)

  const result = await onRemoveLiquidity(
    removeLiquidityCalculation.lpAmount,
    removeLiquidityData.decimals,
    {
      symbol: removeLiquidityData.firstSymbol.replace('WCSPR', 'CSPR'),
      packageHash: removeLiquidityData.firstHash,
      decimals: removeLiquidityData.firstDecimals
    } as any, {
      symbol: removeLiquidityData.secondSymbol.replace('WCSPR', 'CSPR'),
      packageHash: removeLiquidityData.secondHash,
      decimals: removeLiquidityData.secondDecimals
    } as any,
    removeLiquidityCalculation.firstAmount,
    removeLiquidityCalculation.secondAmount,
    1,
    gasFee,
    removeLiquidityToggle)


  if (result) {

    setRemovingPopup(false)
    setRemoveLiquidityInput(0)
    setShowRemoveLiquidityDialog(false)
  } else {
    setRemoveLiquidityButtonDisabled(false)
  }
}

  const handleView = (name: string) => {
    const newRow = getPoolList().filter((item) => item.name === name)[0];

    const combinedBalance = new BigNumber(newRow.balance || 0).plus(newRow.gaugeBalance || 0)

    const ratio = combinedBalance.div(newRow.totalSupply)

    const getStakePercentage = () => {
      let yourStake = 0
      let gaugeTotalStake = 0

      if (newRow.gaugeBalance) {
        yourStake = newRow.gaugeBalance
      }

      if (newRow.gaugeTotalStake) {
        gaugeTotalStake = parseFloat(newRow.gaugeTotalStake)
      }

      const operationCalculation = (yourStake / gaugeTotalStake) * 100

      if (!operationCalculation || !Number.isFinite(operationCalculation)) {
        return "0.00 %"
      }

      return `${((yourStake / gaugeTotalStake) * 100).toFixed(2)} %`
    }

    setPoolDetailRow({
      contractPackage: newRow.packageHash.slice(5),
      token0Icon: newRow.token0Icon,
      token1Icon: newRow.token1Icon,
      token0Symbol: newRow.token0Symbol,
      token1Symbol: newRow.token1Symbol,
      yourLiquidityTokens: `${combinedBalance.isNaN() ? '0' : combinedBalance.toFixed(newRow.decimals)} ${newRow.orderedName}`,
      assetsPooled: {
        asset0: `${isNaN(newRow.reserve0) ? 0 : newRow.reserve0} ${newRow.token0Symbol}`,
        asset1: `${isNaN(newRow.reserve1) ? 0 : newRow.reserve1} ${newRow.token1Symbol}`,
      },
      yourShare: `${(ratio.toNumber() * 100).toFixed(2)}`,
      yourLiquidity: ratio.times(newRow.totalLiquidityUSD).isNaN() ? '$0.00':convertToUSDCurrency(ratio.times(newRow.totalLiquidityUSD).toNumber()),
      volume7D: convertToUSDCurrency(newRow.volume7dUSD || 0),
      fees7D: `${convertToUSDCurrency(isNaN(newRow.volume7d) ? 0 : new BigNumber(newRow.volume7d).times(0.003).toNumber())}`,
      isFavorite: getLocalStorageData("pool")?.includes(name),
      yourStaked: newRow.gaugeBalance ? newRow.gaugeBalance : "0",
      stakedPercentage: getStakePercentage(),
      yourAPR: newRow.userApr ? `${newRow.userApr} %` : "0.00 %"
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
    const invertedName = name.split('-').reverse().join('-')
    const newTableData = tableData.map((item) => {
      if (item.name === name || item.name === invertedName) {
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
            networkLink={`${SUPPORTED_NETWORKS.blockExplorerUrl}/contract-package/`}
            data={tableData}
            handleSwap={goTo}
            handleAddLiquidity={goTo}
            handleTrash={createRemovingDataForPopup}
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
                `${poolDetailRow.token0Symbol}-${poolDetailRow.token1Symbol}`
              )
            }
            widthIcon={45}
            heightIcon={45}
            yourLiquidity={poolDetailRow.yourLiquidity}
            assetsPooled={poolDetailRow.assetsPooled}
            yourShare={poolDetailRow.yourShare}
            yourLiquidityTokens={poolDetailRow.yourLiquidityTokens}
            volume7D={poolDetailRow.volume7D}
            fees7D={poolDetailRow.fees7D}
            yourStaked={poolDetailRow.yourStaked}
            stakedPercentage={poolDetailRow.stakedPercentage}
            yourAPR={poolDetailRow.yourAPR}
          />

          <RemoveLiquidityDialog
            showToggle={showRemovingToggle}
            firstRate={removeLiquidityData.firstRate}
            secondRate={removeLiquidityData.secondRate}
            closeCallback={handleRemoveLiquidity}
            liquidityPoolData={removeLiquidityData as any}
            isOpen={showRemoveLiquidityDialog}
            disabledButton={removeLiquidityButtonDisabled}
            disabledAllowanceButton={removeLiquidityAllowanceEnabled}
            showAllowance={(removeLiquidityCalculation.allowance) > 0}
            defaultValue={removeLiquidityInput}
            isRemoveLiquidityCSPR={removeLiquidityToggle}
            handleChangeInput={handleChangeInput}
            handleToggle={handleRemoveLiquidityToggle}
            handleRemoveLiquidity={handleActionRemoval}
            handleAllowanceLiquidity={() => {setRemoveLiquidityAllowanceEnabled(true); onActionAllowance()}}
            calculatedAmounts={removeLiquidityCalculation}
          />
        </Container>
      </SingleColumn>
    </div>
  );
};
