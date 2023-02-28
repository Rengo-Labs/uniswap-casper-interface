import BigNumber from 'bignumber.js';
import React, {
  createContext,
  ReactNode, useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { NODE_ADDRESS, NotificationType } from '../../constant';

import {
  initialConfigState,
  ConfigReducer,
  ConfigActions,
} from '../../reducers';
import {
  initialPairsState,
  PairsReducer,
  PairActions,
  PairData,
  PairState,
} from '../../reducers/PairsReducer';
import {
  initialTokenState,
  TokenReducer,
  TokenActions,
  TokenAction,
  TokenState,
} from '../../reducers/TokenReducers';

const NETWORK_NAME = Network.CASPER_TESTNET;

import {
  APIClient,
  Client as CasperClient,
  CasperSignerWallet,
  TorusWallet,
  Network,
  Token,
  Wallet,
  convertUIStringToBigNumber,
  log,
  WalletName,
} from '../../commons';

import { signAndDeployAllowance } from '../../commons/deploys';
import { ConfigState } from '../../reducers/ConfigReducers';
import { Row, useAsyncDebounce } from 'react-table';
import { notificationStore } from '../../store/store';
import { ERROR_BLOCKCHAIN } from "../../constant/errors";
import { TableInstance } from "../../components/organisms/PoolModule";
import store from "store2";
import {WalletProviderContext} from "../WalletContext";
import {TokensProviderContext} from "../TokensContext";
import {PairsContextProvider} from "../PairsContext";
import {StateHashProviderContext} from "../StateHashContext";

type MaybeWallet = Wallet | undefined;

interface TVLAndVolume {
  tvl: string,
  totalVolume: string,
}

export interface ConfigContext {
  onConnectWallet?: (name?: WalletName, ignoreError?: boolean) => Promise<void>;
  onDisconnectWallet?: () => Promise<void>;
  configState?: ConfigState;
  tokenState?: TokenState;
  onSelectFirstToken?: (token: string | Token) => void;
  onSelectSecondToken?: (token: string | Token) => void;
  onSwitchTokens?: () => void;
  tokens?: Record<string, Token>;
  firstTokenSelected?: Token;
  secondTokenSelected?: Token;
  isConnected?: boolean;
  slippageToleranceSelected?: number;
  onIncreaseAllow?: (
    amount: number | string,
    contractHash: string
  ) => Promise<boolean>;
  pairState?: PairState;
  confirmModal: boolean;
  linkExplorer: string;
  progressModal: boolean;
  setShowConnectionPopup: (show: boolean) => void;
  showConnectionPopup: boolean;

  // To Delete
  poolColumns?: any[];
  columns?: any[];
  getPoolList?: () => PairData[];
  getTVLandVolume: () => TVLAndVolume;
  isStaked?: boolean;
  setStaked?: (v: boolean) => void;
  filter?: (onlyStaked: boolean, row: Row<PairData>) => any;
  gasPriceSelectedForSwapping?: number;
  gasPriceSelectedForLiquidity?: number;
  refreshAll?: () => Promise<void>;
  setLinkExplorer?: (link: string) => void;
  setProgressModal?: (visible: boolean) => void;
  setConfirmModal?: (visible: boolean) => void;
  calculateUSDtokens: (t0: string, t1: string, amount0: string | number, amount1: string | number) => string[];
  tableInstance?: any,
  setTableInstance?: (t) => void;
  isMobile?: boolean;
  findReservesBySymbols?: (tokenASymbol: string, tokenBSymbol: string) => PairReserves | undefined;
  currentQuery: any,
  setCurrentQuery: (v) => void,
  filterDataReload: (v) => any;
  mapExpandedRows: any[],
  setMapExpandedRows: (l) => void,
  changeRowPriority: (r, p) => void
}

export interface PairReserves {
  reserve0: BigNumber.Value
  reserve1: BigNumber.Value
}

export const ConfigProviderContext = createContext<ConfigContext>({} as any);

export const casperClient = new CasperClient(NETWORK_NAME, NODE_ADDRESS);

export const apiClient = new APIClient(casperClient);

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

export const convertNumber = (number: number) => {
  return formatter.format(number);
};

/**
 * Return type for GetStatus
 */
export type StatusResponseType = {
  // network token balance of the account
  balance: BigNumber;
  // uref of the main purse
  mainPurse: string;
};

/**
 * Get the balance and main purse of the wallet
 *
 * @param wallet Wallet whose account is being used
 * @returns the balance and make purse uref
 */
export async function getStatus(wallet: Wallet): Promise<StatusResponseType> {
  const balance = await casperClient.getBalance(wallet);
  const mainPurse = await casperClient.getMainPurse(wallet);

  return { balance, mainPurse };
}

export const ConfigContextWithReducer = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {walletState, onConnectWallet, onDisconnectWallet} = useContext(WalletProviderContext)
  const {refresh} = useContext(StateHashProviderContext)
  const {tokenState, tokenDispatch} = useContext(TokensProviderContext)
  const {pairState, pairDispatch, findReservesBySymbols} = useContext(PairsContextProvider)
  const [state, dispatch] = useReducer(ConfigReducer, initialConfigState);
  //const [tokenState, tokenDispatch] = useReducer(TokenReducer, initialTokenState);

  // TODO ESTO SE VA PARA PAIR CONTEXT
  //const [pairState, pairDispatch] = useReducer(PairsReducer, initialPairsState);

  const { tokens } = tokenState;
  const [progressModal, setProgressModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const columns = getColumns();
  const poolColumns = React.useMemo(() => columns, []);
  const [isStaked, setStaked] = useState(false);
  const [linkExplorer, setLinkExplorer] = useState('');
  const { updateNotification, dismissNotification } = notificationStore();
  const [tableInstance, setTableInstance] = useState<any>({})
  const [currentQuery, setCurrentQuery] = useState("")
  const [mapExpandedRows, setMapExpandedRows] = useState([])

  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  const [requestConnectWallet, setRequestConnectWallet] = useState(0);

  const [isMobile, setIsMobile] = useState(false)

  let debounceConnect = false;

  /**
   * return value for connect()
   */
  type ConnectReturn = {
    // wallet
    wallet?: Wallet;
    // balance of wallet
    balance: BigNumber;
    // main purse of wallet's address
    mainPurse: string;
    // wallet accountHashString
    walletAddress: string;
    // was the connection successful?
    isConnected: boolean;
  };

  /**
   * Connect to the currently selected wallet
   *
   * @param name name of wallet to connect
   *
   * @returns wallet, balance, mainPurse, and walletAddress
   */
  async function connect(
    name: WalletName = WalletName.NONE
  ): Promise<ConnectReturn> {
    if (debounceConnect) {
      return {
        wallet: state.wallet,
        mainPurse: state.mainPurse,
        walletAddress: state.wallet?.accountHashString ?? '',
        balance: convertUIStringToBigNumber(tokenState.tokens.CSPR.amount),
        isConnected: state.wallet?.isConnected ?? false,
      };
    }

    debounceConnect = true;
    let w: MaybeWallet;

    switch (name) {
      case WalletName.CASPER_SIGNER:
        try {
          if (state.wallet?.isConnected) {
            await state.wallet.disconnect();
          }

          w = new CasperSignerWallet(NETWORK_NAME);
          await w.connect();
        } catch (e) {
          debounceConnect = false;
          throw e;
        }

        if (!w?.publicKey) {
          debounceConnect = false;
          throw new Error('casper signer error');
        }
        break;
      case WalletName.TORUS:
        try {
          if (state.wallet?.isConnected) {
            await state.wallet.disconnect();
          }

          w = new TorusWallet(NETWORK_NAME);
          await w.connect();
        } catch (e) {
          debounceConnect = false;
          throw e;
        }

        if (!w?.publicKey) {
          debounceConnect = false;
          throw new Error('torus wallet error');
        }
        break;
      default:
        setShowConnectionPopup(true);
        return {
          mainPurse: '',
          walletAddress: '',
          balance: convertUIStringToBigNumber(tokenState.tokens.CSPR.amount),
          isConnected: false,
        };
    }

    try {
      const { balance, mainPurse } = await getStatus(w);

      debounceConnect = false;

      return {
        wallet: w,
        balance,
        mainPurse,
        walletAddress: w.accountHashString,
        isConnected: w.isConnected,
      };
    } catch {
      updateNotification({
        type: NotificationType.Error,
        title: 'No main purse detected',
        subtitle: 'Add CSPR to the wallet before proceeding.',
        show: true,
        chargerBar: false
      });

      debounceConnect = false;

      return {
        wallet: w,
        balance: new BigNumber(0),
        mainPurse,
        walletAddress: w.accountHashString,
        isConnected: w.isConnected,
      };
    }

  }


  const {isConnected, slippageToleranceSelected, mainPurse } =
    walletState;

  useEffect(() => {
    const fn = async () => {
      refresh()
      /*const data = await apiClient.getTokenList();
      const tokens = tokensToObject(data.tokens);
      //console.log('TOKENS', tokens)
      tokenDispatch({
        type: TokenActions.UPDATE_TOKENS,
        payload: { tokens } as any,
      });*/
    };

    fn().catch((e) => log.error(`UPDATE_TOKENS error": ${e}`));
  }, []);

  useEffect(() => {
    const fn = async () => {
      //console.log('wat', state)
      if (walletState?.wallet) {
        console.log('update', walletState);
        await walletState.wallet.getActiveKey();
        dispatch({
          type: ConfigActions.CONNECT_WALLET,
          payload: { wallet: walletState.wallet },
        });
        refresh(walletState.wallet);
      }
    };

    fn();
  }, [requestConnectWallet]);


  // TODO move a un pools responsabilities
  function getColumns() {
    return [
      {
        id: 1,
        Header: 'Pool',
        accessor: 'name',
        Cell: (tableProps: any) => (
          <img
            src={tableProps.row.original.tokeIcon}
            width={25}
            alt='Token Icon'
          />
        ),
      },
      {
        id: 2,
        Header: 'Liquidity',
        accessor: 'totalSupply',
      },
      {
        id: 3,
        Header: 'Volume 7D',
        accessor: 'volume7d',
      },
      {
        id: 4,
        Header: 'Fees 7d',
        accessor: 'fees24h',
      },
      {
        id: 5,
        Header: 'APR 7D',
        accessor: 'oneYFees',
      },
    ];
  }

  const getTVLandVolume = (): TVLAndVolume => {
    const pairs = Object.values(pairState)

    const tvl = pairs.reduce((acc, pl) => {
      return acc += parseFloat(pl.totalLiquidityUSD)
    }, 0).toFixed(2)

    const totalVolume = pairs.reduce((acc, pl) => {
      return acc += parseFloat(pl.volume7d)
    }, 0).toFixed(2)

    const data = {
      tvl,
      totalVolume,
    };

    return data
  };

  // TODO BORRAR se movio al pair responsabilities
  const getPoolList = (): PairData[] => {
    return Object.entries(pairState).map(([k, v]) => {
      return v;
    });
  };

  const filter = (onlyStaked: boolean, row: Row<PairData>): any => {
    if (onlyStaked) {
      return parseFloat(row.original.balance) > 0;
    }

    return row;
  };

  const filterDataReload = (row: Row<PairData>): any => {
    if (currentQuery.trim().length == 0) return true;

    const data = row.original
    const query = currentQuery.toUpperCase()

    if (data.name.includes(query) || data.totalSupply.includes(query)
      || data.volume7d.includes(query) || data.volume1d.includes(query)) {
      return true
    }
    return false
  }

  const { setGlobalFilter } = tableInstance as any as TableInstance<PairData>
  const changeData = useAsyncDebounce(value => {
    if (setGlobalFilter != undefined) {
      setGlobalFilter(value || "")
    }
  }, 100)
  // END MOVER A UN POOL RESPONSABILITIES

  // TODO - remove this functionS / Moved to poolresponsibilities
  function onSelectFirstToken(token: string | Token): void {
    if (typeof token === 'string') {
      tokenDispatch({ type: TokenActions.SELECT_FIRST_TOKEN, payload: token });
    } else {
      tokenDispatch({
        type: TokenActions.SELECT_FIRST_TOKEN,
        payload: token.symbol,
      });
    }
  }

  function onSelectSecondToken(token: string | Token): void {
    if (typeof token === 'string') {
      tokenDispatch({ type: TokenActions.SELECT_SECOND_TOKEN, payload: token });
    } else {
      tokenDispatch({
        type: TokenActions.SELECT_SECOND_TOKEN,
        payload: token.symbol,
      });
    }
  }

  function onSwitchTokens(): void {
    tokenDispatch({ type: TokenActions.SWITCH_TOKENS });
  }

  async function onIncreaseAllow(
    amount: number | string,
    contractHash: string
  ): Promise<boolean> {
    updateNotification({
      type: NotificationType.Loading,
      title: 'Increasing allowance.',
      subtitle: '',
      show: true,
      chargerBar: false
    });

    try {
      const [deployHash, deployResult] = await signAndDeployAllowance(
        casperClient,
        state.wallet,
        contractHash,
        convertUIStringToBigNumber(amount)
      );

      setProgressModal(true);
      setLinkExplorer(`https://testnet.cspr.live/deploy/${deployHash}`);

      const result = await casperClient.waitForDeployExecution(deployHash);
      setProgressModal(false);
      setConfirmModal(true);
      updateNotification({
        type: NotificationType.Success,
        title: 'Success',
        subtitle: '',
        show: true,
        chargerBar: true
      });
      refresh(state.wallet);
      return true;
    } catch (err) {
      setProgressModal(false);
      updateNotification({
        type: NotificationType.Error,
        title: ERROR_BLOCKCHAIN[`${err}`] ? ERROR_BLOCKCHAIN[`${err}`].message : `${err}`,
        subtitle: '',
        show: true,
        chargerBar: true
      });
      refresh(state.wallet);
      return false;
    }
  }

  const refreshAll = async (): Promise<void> => {
    await refresh(state.wallet);
    changeData(currentQuery)
  }

  const calculateUSDtokens = (token0: string, token1: string, amount0: string | number, amount1: string | number): string[] => {
    const filter = getPoolList().filter(
      (r) => r.token0Symbol === token0 && r.token1Symbol === token1
    );
    if (filter.length > 0) {
      return [
        new BigNumber(amount0).times(filter[0].token0Price).toFixed(2),
        new BigNumber(amount1).times(filter[0].token1Price).toFixed(2),
      ];
    }

    const filter2 = getPoolList().filter(
      (r) => r.token1Symbol === token0 && r.token0Symbol === token1
    );
    if (filter2.length > 0) {
      return [
        new BigNumber(amount0).times(filter2[0].token0Price).toFixed(2),
        new BigNumber(amount1).times(filter2[0].token1Price).toFixed(2),
      ];
    }

    return ['0.00', '0.00']
  };

  const changeRowPriority = (name, priority) => {
    store.set(name, priority)
    pairDispatch({
      type: PairActions.CHANGE_PRIORITY,
      payload: {
        name: name,
        checked: priority
      }
    });
  }

  return (
    <ConfigProviderContext.Provider
      value={{
        onConnectWallet,
        onDisconnectWallet,
        configState: walletState,
        tokenState,
        onSelectFirstToken,
        onSelectSecondToken,
        onSwitchTokens,
        tokens,
        firstTokenSelected: tokenState.tokens[tokenState.firstTokenSelected],
        secondTokenSelected: tokenState.tokens[tokenState.secondTokenSelected],
        isConnected: walletState?.isConnected,
        slippageToleranceSelected,
        onIncreaseAllow,
        pairState,
        poolColumns,
        columns,
        getPoolList,
        getTVLandVolume,
        isStaked,
        setStaked,
        filter,
        gasPriceSelectedForSwapping: state.gasPriceSelectedForSwapping,
        gasPriceSelectedForLiquidity: state.gasPriceSelectedForLiquidity,
        refreshAll,
        setLinkExplorer,
        setProgressModal,
        setConfirmModal,
        calculateUSDtokens,
        tableInstance,
        setTableInstance,
        isMobile,
        findReservesBySymbols,
        currentQuery,
        setCurrentQuery,
        filterDataReload,
        mapExpandedRows,
        setMapExpandedRows,
        changeRowPriority,
        confirmModal,
        linkExplorer,
        progressModal,
        setShowConnectionPopup,
        showConnectionPopup
      }}
    >
      {children}
    </ConfigProviderContext.Provider>
  );
};
