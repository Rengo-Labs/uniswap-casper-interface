import { SingleColumn } from "../../../layout/SingleColumn";
import { PoolTable, LPSearch, PoolItemDetails, RemoveLiquidityDialog } from "rengo-ui-kit";
import usdcTokenIcon from "../../../assets/swapIcons/btc.png";
import { Container, SubHeader } from "./styles";
import { useTheme } from "styled-components";
import { PairsContextProvider } from "../../../contexts/PairsContext";
import { ProgressBarProviderContext } from "../../../contexts/ProgressBarContext";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ConfigProviderContext, convertNumber } from "../../../contexts/ConfigContext";
import BigNumber from "bignumber.js";
import { useNavigate } from "react-router-dom";
import { StateHashProviderContext } from "../../../contexts/StateHashContext";
import {
  getLocalStorageData,
  setLocalStorageData,
} from "../../../commons/utils/persistData";
import {LiquidityProviderContext} from "../../../contexts/LiquidityContext";
import wcsprIcon from "../../../assets/swapIcons/wrappedCasperIcon.png";
import csprIcon from "../../../assets/swapIcons/casperIcon.png";
import { globalStore } from "../../../store/store";
import { TokensProviderContext } from "../../../contexts/TokensContext";

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
}

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
  const [poolDetailRow, setPoolDetailRow] = useState<IPoolDetailRow>(poolDetailsRowDefault);
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
    decimals: 9,
    secondIcon: '',
    secondName: 'WETH',
    secondSymbol: 'WETH',
    secondLiquidity: '0',
    secondRate: '0',
    secondHash: ''
  })
  const [removeLiquidityCalculation, setRemoveLiquidityCalculation] = useState<any>({
    lpAmount: 0,
    firstAmount: 0,
    secondAmount: 0,
    allowance: 0
  })
  const [removeLiquidityToggle, setRemoveLiquidityToggle] = useState(true)
  const { slippageTolerance, updateSlippageTolerance } = globalStore()
  const [gasFee, gasFeeSetter] = useState<number>(gasPriceSelectedForLiquidity)
  const [removeLiquidityButtonDisabled, setRemoveLiquidityButtonDisabled] = useState(true)

  useEffect(() => {

    setTableData(getPoolList().map((item) => ({
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
    })))
  }, [pairState])

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
    setPoolDetailRow(poolDetailsRowDefault)
    setShowPoolDetails(prev => !prev);
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
    
    const data = {
        id: pairRemoteData.contractHash,
        tokenName: pairRemoteData.name,
        liquidity: pairRemoteData.balance,
        allowance: parseFloat(pairRemoteData.allowance),
        firstIcon: pairRemoteData.token0Symbol === 'CSPR' ? csprIcon : pairRemoteData.token0Icon,
        firstName: pairRemoteData.token0Symbol === 'CSPR' ? 'Casper' : pairRemoteData.token0Name,
        firstSymbol: pairRemoteData.token0Symbol,
        firstLiquidity: pairRemoteData.reserve0,
        firstRate: '',
        firstHash: pairRemoteData.contract0,
        secondIcon: pairRemoteData.token1Symbol === 'CSPR' ? csprIcon : pairRemoteData.token1Icon,
        secondName: pairRemoteData.token1Symbol === 'CSPR' ? 'Casper' : pairRemoteData.token1Name,
        secondSymbol: pairRemoteData.token1Symbol,
        secondLiquidity: pairRemoteData.reserve1,
        secondRate: '',
        secondHash: pairRemoteData.contract1,
        decimals: pairRemoteData.decimals
    }
    
    setRemoveLiquidityData((prevState) => ({
        ...prevState,
        ...data
    }))

    setRemoveLiquidityCalculation((prevState => ({...prevState, lpAmount: 0, firstAmount: 0, secondAmount: 0, allowance: parseFloat(pairRemoteData.liquidity) - parseFloat(pairRemoteData.allowance)})))
    setShowRemoveLiquidityDialog(true)
  }

  const onActionAllowance = async () => {
    await onIncreaseAllow(removeLiquidityCalculation.allowance, removeLiquidityData.id)
  }

  const handleRemoveLiquidity =  () => {
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
  setRemovingPopup(false)
  setRemoveLiquidityInput(0)
  setShowRemoveLiquidityDialog(false)

  await onRemoveLiquidity(
    removeLiquidityCalculation.lpAmount,
    {
        symbol: removeLiquidityData.firstSymbol.replace('WCSPR', 'CSPR'),
        packageHash: removeLiquidityData.firstHash,
    } as any, {
        symbol: removeLiquidityData.secondSymbol.replace('WCSPR', 'CSPR'),
        packageHash: removeLiquidityData.secondHash,
    } as any,
    removeLiquidityCalculation.firstAmount,
    removeLiquidityCalculation.secondAmount,
    slippageTolerance,
    gasFee,
    removeLiquidityToggle)
}

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
      yourShare: (Number(newRow.balance) / Number(newRow.totalSupply)).toFixed(2),
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
    const newTableData = tableData.map(item => {
      if (item.name === name) {
        return {
          ...item,
          isFavorite: !isFavorite
        }

      }
      return item
    })

    setTableData(newTableData)
  }

  const updateLocalStorage = (name: string, currentPersistedData: string[], isFavorite: boolean) => {
    const newLocalStorageData = isFavorite ? currentPersistedData.filter(item => item !== name) : [...currentPersistedData, name]
    setLocalStorageData("pool", newLocalStorageData);
  }

  const handleFavorite = (name: string) => {
    const currentPersistedData: string[] = getLocalStorageData("pool");
    const isPresent = currentPersistedData.includes(name)

    updateTableData(name, isPresent)
    setPoolDetailRow({...poolDetailRow, isFavorite: !isPresent })

    updateLocalStorage(name, currentPersistedData, isPresent)
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

          <RemoveLiquidityDialog
            closeCallback={handleRemoveLiquidity}
            liquidityPoolData={removeLiquidityData as any}
            isOpen={showRemoveLiquidityDialog}
            disabledButton={removeLiquidityButtonDisabled}
            disabledAllowanceButton={false}
            showAllowance={(removeLiquidityCalculation.allowance) > 0}
            defaultValue={removeLiquidityInput}
            isRemoveLiquidityCSPR={removeLiquidityToggle}
            handleChangeInput={handleChangeInput}
            handleToggle={handleRemoveLiquidityToggle}
            handleRemoveLiquidity={handleActionRemoval}
            handleAllowanceLiquidity={onActionAllowance}
            calculatedAmounts={removeLiquidityCalculation}
          />
        </Container>
      </SingleColumn>
    </div>
  );
};
