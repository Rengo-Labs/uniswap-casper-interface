
import BigNumber from 'bignumber.js';
import React, {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { PopupsModule } from '../../components/organisms';
import { BASE_URL, NODE_ADDRESS, NotificationType } from '../../constant';

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
  convertBigNumberToUIString,
  convertUIStringToBigNumber,
  log,
  WalletName,
} from '../../commons';

import { signAndDeployAllowance } from '../../commons/deploys';
import { ConfigState } from '../../reducers/ConfigReducers';
import {Row, useAsyncDebounce, useGlobalFilter, useSortBy, useTable} from 'react-table';
import { ConnectionPopup } from '../../components/atoms';
import { notificationStore } from '../../store/store';
import { ERROR_BLOCKCHAIN } from "../../constant/errors";
import { getPath } from '../../commons/calculations'
import {TableInstance} from "../../components/organisms/PoolModule";
import {getPairData} from "../../commons/api/InfoSwapClient";

type MaybeWallet = Wallet | undefined;

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

  // To Delete
  poolColumns?: any[];
  columns?: any[];
  getPoolList?: () => PairData[];
  getTVLandVolume?: () => Promise<void>;
  gralData?: Record<string, string>;
  isStaked?: boolean;
  setStaked?: (v: boolean) => void;
  filter?: (onlyStaked: boolean, row: Row<PairData>) => any;
  gasPriceSelectedForSwapping?: number;
  gasPriceSelectedForLiquidity?: number;
  refreshAll?: () => Promise<void>;
  setLinkExplorer?: (link: string) => void;
  setProgressModal?: (visible: boolean) => void;
  setConfirmModal?: (visible: boolean) => void;
  calculateUSDtokens: (t0, t1, amount0, amount1) => any[];
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

export const apiClient = new APIClient(BASE_URL, casperClient);

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
  const [state, dispatch] = useReducer(ConfigReducer, initialConfigState);
  const [tokenState, tokenDispatch] = useReducer(
    TokenReducer,
    initialTokenState
  );
  const [pairState, pairDispatch] = useReducer(
    PairsReducer,
    initialPairsState
  );
  const { tokens } = tokenState;
  const [progressModal, setProgressModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const columns = getColumns();
  const poolColumns = React.useMemo(() => columns, []);
  const [gralData, setGralData] = useState({});
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

  async function updateBalances(
    wallet: Wallet,
    tokens: Record<string, Token>,
    tokenDispatch: React.Dispatch<TokenAction>,
    isConnected: boolean
  ): Promise<void> {
    if (!isConnected) {
      return;
    }

    try {
      //console.log('tokenState', tokenState)
      const ps = Object.keys(tokens).map((x) => {
        const token = tokens[x];

        //console.log('token', x, token)
        if (tokens[x].contractHash) {
          return Promise.all([
            apiClient
              .getERC20Allowance(
                wallet,
                token.contractHash
              )
              .then((response) => {
                //console.log('allowance', token, response)
                tokenDispatch({
                  type: TokenActions.LOAD_ALLOWANCE,
                  payload: {
                    name: x,
                    allowance: convertBigNumberToUIString(
                      new BigNumber(response)
                    ),
                  },
                });
              }),
            apiClient
              .getERC20Balance(
                wallet,
                token.contractHash
              )
              .then((response) => {
                //console.log('balance', token, response)
                console.log(x, convertBigNumberToUIString(new BigNumber(response)).toString())
                tokenDispatch({
                  type: TokenActions.LOAD_BALANCE,
                  payload: {
                    name: x,
                    amount: convertBigNumberToUIString(
                      new BigNumber(response)
                    ),
                  },
                });
              }),
          ]);
        } else {
          return casperClient.getBalance(wallet).then((balance) => {
            //console.log('balance', convertBigNumberToUIString(balance))
            tokenDispatch({
              type: TokenActions.LOAD_BALANCE,
              payload: {
                name: 'CSPR',
                amount: convertBigNumberToUIString(balance),
              },
            });
          });
        }
      });

      await Promise.all(ps);
    } catch (err) {
      log.error(`updateBalances error: ${err}`);
    }
  }

  async function refresh(wallet?: Wallet) {
    if (wallet) {
      await updateBalances(wallet, tokens, tokenDispatch, wallet?.isConnected);
      await loadPairsUserData(wallet, wallet?.isConnected);
    } else {
      await clearPairsUserData()
    }
    await loadPairs();
    await getTVLandVolume()
  }

  const clearPairsUserData = async () => {
    Object.keys(tokens).map((x) => {
      if (tokens[x].contractHash) {
        tokenDispatch({
          type: TokenActions.LOAD_ALLOWANCE,
          payload: {
            name: x,
            allowance: convertBigNumberToUIString(
              new BigNumber(0)
            ),
          },
        })

        tokenDispatch({
          type: TokenActions.LOAD_BALANCE,
          payload: {
            name: x,
            amount: convertBigNumberToUIString(
              new BigNumber(0)
            ),
          },
        })
      } else {
        tokenDispatch({
          type: TokenActions.LOAD_BALANCE,
          payload: {
            name: 'CSPR',
            amount: convertBigNumberToUIString(new BigNumber(0)),
          },
        })
      }
    });

    const pairList = Object.keys(pairState).map((x) => pairState[x]);
    for (const pair of pairList) {

      pairDispatch({
        type: PairActions.ADD_ALLOWANCE_TO_PAIR,
        payload: {
          name: pair.name,
          allowance: convertBigNumberToUIString(
            new BigNumber(0)
          ),
        },
      })

      pairDispatch({
        type: PairActions.ADD_BALANCE_TO_PAIR,
        payload: {
          name: pair.name,
          balance: convertBigNumberToUIString(
            new BigNumber(0)
          ),
        },
      })
    }
  }

  async function onConnectWallet(
    name: WalletName = WalletName.NONE,
    ignoreError = false
  ): Promise<void> {
    if (state.wallet?.isConnected) {
      return;
    }

    if (debounceConnect) {
      return;
    }

    try {
      const ret = await connect(name);

      if (!ret.isConnected) {
        return;
      }
      updateNotification({
        type: NotificationType.Loading,
        title: 'Connecting to your wallet...',
        subtitle: '',
        show: true,
        chargerBar: false
      });

      dispatch({
        type: ConfigActions.SELECT_MAIN_PURSE,
        payload: { mainPurse: ret.mainPurse },
      });
      dispatch({
        type: ConfigActions.CONNECT_WALLET,
        payload: { wallet: ret.wallet },
      });

      await refresh(ret.wallet);
      updateNotification({
        type: NotificationType.Success,
        title: 'Connected',
        subtitle: '',
        show: true,
        timeToClose: 10,
        chargerBar: true
      });
    } catch (err) {
      log.error(`onConnectWallet error: ${err}`);
      dismissNotification();
      if (ignoreError) {
        return
      }

      if(err.message.includes('make sure you have the Signer installed')) {
        updateNotification({
          type: NotificationType.Error,
          title: 'This wallet is not installed.',
          subtitle: '',
          show: true,
          chargerBar: true
        })
        return;
      }

      if (err.message === 'main purse does not exist') {
        updateNotification({
          type: NotificationType.Error,
          title: 'Main purse does not exist, send CSPR to your wallet first',
          subtitle: '',
          show: true,
          chargerBar: true
        })
        return
      }

      updateNotification({
        type: NotificationType.Error,
        title: 'Ooops we have an error',
        subtitle: '',
        show: true,
        chargerBar: true
      });
    }
  }

  const { isConnected, walletSelected, slippageToleranceSelected, mainPurse } =
    state;

  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
  })

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
    window.addEventListener('signer:connected', (msg) => {
      console.log('signer:connected', msg);
    });
    window.addEventListener('signer:disconnected', (msg) => {
      console.log('signer:disconnected', msg);
      //onDisconnectWallet()
    });
    window.addEventListener('signer:tabUpdated', (msg) => {
      console.log('signer:tabUpdated', msg);
      //onConnectConfig()
    });
    window.addEventListener('signer:activeKeyChanged', async (msg) => {
      console.log('signer:activeKeyChanged', msg);
      setRequestConnectWallet(Math.random() * 1 ** 9);
    });
    window.addEventListener('signer:locked', (msg) => {
      console.log('signer:locked', msg);
    });
    window.addEventListener('signer:unlocked', (msg) => {
      console.log('signer:unlocked', msg);
      //onConnectConfig()
    });

    window.addEventListener('signer:initialState', (msg) => {
      console.log('signer:initialState', msg);
      //connect()
    });
  }, []);

  useEffect(() => {
    const fn = async () => {
      //console.log('wat', state)
      if (state?.wallet) {
        console.log('update', state);
        await state.wallet.getActiveKey();
        dispatch({
          type: ConfigActions.CONNECT_WALLET,
          payload: { wallet: state.wallet },
        });
        refresh(state.wallet);
      }
    };

    fn();
  }, [requestConnectWallet]);

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

  const getTVLandVolume = async (): Promise<void> => {
    const data = {
      tvl: '192,168,000,000',
      totalVolume: '1,000,000',
    };

    setGralData(data);
  };

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
      || data.volume7d.includes(query) || data.fees24h.includes(query) || data.oneYFees.includes(query)) {
      return true
    }
    return false
  }

  interface PairTotalReserves {
    totalReserve0: BigNumber.Value,
    totalReserve1: BigNumber.Value,
  }

  async function loadPairs(): Promise<void> {
    try {
      const pairs = Object.values(pairState)
      const pairTotalReserves: Record<string, PairTotalReserves> = {}

      const results = await Promise.all(pairs.map(async (pl) => {
        const pairDataResponse = await apiClient.getPairData(pl.contractHash)
        const result = await getPairData([pl.packageHash.substr(5)])
        const token0Decimals = tokenState.tokens[pl.token0Symbol].decimals;
        const token1Decimals = tokenState.tokens[pl.token1Symbol].decimals;
        const reserve0 = convertBigNumberToUIString(
          new BigNumber(pairDataResponse.reserve0),
          token0Decimals
        );
        const reserve1 = convertBigNumberToUIString(
          new BigNumber(pairDataResponse.reserve1),
          token1Decimals
        );

        return {
          name: pl.name,
          totalReserve0: reserve0,
          totalReserve1: reserve1,
          volume7d: new BigNumber(
            convertBigNumberToUIString(new BigNumber(0), 9)
          ).toFixed(2),
          fees24h: '0',
          oneYFees: '0',
          volume: convertBigNumberToUIString(new BigNumber(0), 9),
          totalSupply: convertBigNumberToUIString(
            new BigNumber(pairDataResponse.totalSupply)
          ),
          totalLiquidityUSD: convertBigNumberToUIString(
            new BigNumber(result.length != 0 ? result[0].reserveUSD : 0)
          )
        }
      }))
      for (const pl of results) {

        pairDispatch({
          type: PairActions.LOAD_PAIR,
          payload: {
            name: pl.name,
            volume7d: pl.volume7d,
            fees24h: pl.fees24h,
            oneYFees: pl.oneYFees,
            volume: pl.volume,
            totalReserve0: pl.totalReserve0,
            totalReserve1: pl.totalReserve1,
            totalSupply: pl.totalSupply,
            totalLiquidityUSD: pl.totalLiquidityUSD
          },
        })

        pairTotalReserves[pl.name] = {
          totalReserve0: pl.totalReserve0,
          totalReserve1: pl.totalReserve1,
        }
      }

      console.log('pairTotalReserves', pairTotalReserves)

      await loadPairsUSD(pairTotalReserves)
    } catch (err) {
      log.error('loadPairs', err.message);
    }
  }

  async function loadPairsUSD(pairTotalReserves: Record<string, PairTotalReserves>): Promise<void> {
    try {
      const tokens = Object.values(tokenState.tokens)
      const tokenPrices: Record<string, string> = {}

      for (const t of tokens) {
        const priceUSD = findUSDRateBySymbol(t.symbolPair, pairTotalReserves).toString()

        tokenDispatch({
          type: TokenActions.LOAD_PRICE_USD,
          payload: {
            name: t.symbol,
            priceUSD,
          },
        })

        tokenPrices[t.symbol] = priceUSD
      }

      const pairs = Object.values(pairState)

      for (const p of pairs) {
        pairDispatch({
          type: PairActions.LOAD_PAIR_USD,
          payload: {
            name: p.name,
            token0Price: tokenPrices[p.token0Symbol],
            token1Price: tokenPrices[p.token1Symbol],
          },
        })
      }

    } catch (err) {
      log.error('loadPairsUSD', err.message);
    }
  }

  async function loadPairsUserData(wallet: Wallet, isConnected = false): Promise<void> {
    if (!isConnected) {
      return;
    }

    try {
      const ps = [];
      const pairList = Object.keys(pairState).map((x) => pairState[x]);
      for (const pair of pairList) {
        ps.push(
          apiClient
            .getERC20Allowance(
              wallet,
              pair.contractHash,
            )
            .then((response) => {
              pairDispatch({
                type: PairActions.ADD_ALLOWANCE_TO_PAIR,
                payload: {
                  name: pair.name,
                  allowance: convertBigNumberToUIString(
                    new BigNumber(response)
                  ),
                },
              });
            }),
          apiClient
            .getERC20Balance(
              wallet,
              pair.contractHash,
            )
            .then((response) => {
              pairDispatch({
                type: PairActions.ADD_BALANCE_TO_PAIR,
                payload: {
                  name: pair.name,
                  balance: convertBigNumberToUIString(
                    new BigNumber(response)
                  ),
                },
              });
            }),
        )
      }

      await Promise.all(ps);
    } catch (err) {
      log.error('fillPairs', err.message);
    }
  }

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

  async function onDisconnectWallet(): Promise<void> {
    try {
      if (state.wallet) {
        await state.wallet.disconnect();

        dispatch({ type: ConfigActions.DISCONNECT_WALLET, payload: {} }),
          updateNotification({
            type: NotificationType.Success,
            title: 'Your wallet is disconnected',
            subtitle: '',
            show: true,
            timeToClose: 5,
            chargerBar: true
          });
      }
    } catch (error) {
      updateNotification({
        type: NotificationType.Error,
        title: 'Error disconnecting wallet',
        subtitle: '',
        show: true,
        timeToClose: 10,
        chargerBar: true
      });
    }
  }

  const {setGlobalFilter} = tableInstance as any as TableInstance<PairData>
  const changeData = useAsyncDebounce(value => {
      if(setGlobalFilter != undefined) {
        setGlobalFilter(value || "")
      }
  }, 100)

  const refreshAll = async (): Promise<void> => {
    await refresh(state.wallet);
    changeData(currentQuery)
  };

  const calculateUSDtokens = (token0, token1, amount0, amount1): any[] => {
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

  /**
   * findReservesBySymbols search for pair data by the symbol pair
   *
   * @param tokenASymbol first token symbol string
   * @param tokenBSymbol second token symbol string
   *
   * @returns pair reserve data
   */
  const findReservesBySymbols = (
    tokenASymbol: string,
    tokenBSymbol: string,
    overrideReserves: Record<string, PairTotalReserves> = {},
  ): PairReserves | undefined => {
    let tA = tokenASymbol
    let tB = tokenBSymbol
    if (tA === 'CSPR') {
      tA = 'WCSPR'
    }
    if (tB === 'CSPR') {
      tB = 'WCSPR'
    }

    let lookUp = `${tA}-${tB}`

    // do a simple look up
    let pairData = overrideReserves[lookUp] ?? pairState[lookUp]

    if (pairData) {
      return {
        reserve0: convertUIStringToBigNumber(pairData.totalReserve1),
        reserve1: convertUIStringToBigNumber(pairData.totalReserve0),
      }
    }

    // do different simple look up
    lookUp = `${tB}-${tA}`
    pairData = overrideReserves[lookUp] ?? pairState[lookUp]

    if (pairData) {
      return {
        reserve0: convertUIStringToBigNumber(pairData.totalReserve0),
        reserve1: convertUIStringToBigNumber(pairData.totalReserve1),
      }
    }

    // use pathfinder for multi-pool
    const path = getPath(
      tA,
      tB,
      Object.values(tokenState.tokens),
      Object.values(pairState)
    )

    if (!path || !path.length) {
      updateNotification({
        type: NotificationType.Error,
        title: `Path between ${tA}-${tB} not found`,
        subtitle: '',
        show: true,
        timeToClose: 10,
        chargerBar: true
      })
      throw new Error('path not found')
    }
    console.log('path', path)

    let firstReserve0 = new BigNumber(1)
    let reserve0 = new BigNumber(1)
    let reserve1 = new BigNumber(1)
    for (let i = 1; i < path.length; i++) {
      const pair = overrideReserves[path[i].label.name] ?? path[i].label
      if (path[i-1].id == tokenASymbol) {
        reserve0 = reserve0.times(convertUIStringToBigNumber(pair.totalReserve1))
        reserve1 = reserve1.times(convertUIStringToBigNumber(pair.totalReserve0))
      } else {
        reserve0 = reserve0.times(convertUIStringToBigNumber(pair.totalReserve0))
        reserve1 = reserve1.times(convertUIStringToBigNumber(pair.totalReserve1))
      }

      if (i == 1) {
        firstReserve0 = reserve0
      }
    }

    const ratio = firstReserve0.div(reserve0)

    return {
      reserve0: firstReserve0,
      reserve1: reserve1.times(ratio),
    }
  }

  /**
   * findReservesBySymbols search for pair data by the symbol pair
   *
   * @param tokenSymbol token symbol string
   *
   * @returns usd conversion rate
   */
  const findUSDRateBySymbol = (
    tokenSymbol: string,
    pairTotalReserves: Record<string, PairTotalReserves>,
  ): BigNumber => {
    let t = tokenSymbol
    if (t === 'CSPR') {
      t = 'WCSPR'
    }

    if (t === 'USDC') {
      const ratesUSDC = findReservesBySymbols(t, 'USDT', pairTotalReserves)

      return new BigNumber(ratesUSDC.reserve0).div(ratesUSDC.reserve1).plus(1).div(2)
    }

    if (t === 'USDT') {
      const ratesUSDT = findReservesBySymbols(t, 'USDC', pairTotalReserves)

      return new BigNumber(ratesUSDT.reserve0).div(ratesUSDT.reserve1).plus(1).div(2)
    }

    const ratesUSDC = findReservesBySymbols(t, 'USDC', pairTotalReserves)
    const ratesUSDT = findReservesBySymbols(t, 'USDT', pairTotalReserves)

    // console.log('ratesUSDC/T', ratesUSDC.reserve0.toString(), ratesUSDT.reserve0.toString())

    return new BigNumber(ratesUSDC.reserve1).div(ratesUSDC.reserve0).plus(BigNumber(ratesUSDT.reserve1).div(ratesUSDT.reserve0)).div(2)
  }

  const changeRowPriority = (name, priority) => {
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
        configState: state,
        tokenState,
        onSelectFirstToken,
        onSelectSecondToken,
        onSwitchTokens,
        tokens,
        firstTokenSelected: tokenState.tokens[tokenState.firstTokenSelected],
        secondTokenSelected: tokenState.tokens[tokenState.secondTokenSelected],
        isConnected,
        slippageToleranceSelected,
        onIncreaseAllow,
        pairState,
        poolColumns,
        columns,
        getPoolList,
        getTVLandVolume,
        gralData,
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
        changeRowPriority
      }}
    >
      {children}
      <PopupsModule
        isOpen={progressModal}
        handleOpen={setProgressModal}
        progress
      >
        Check the progress of your{' '}
        <a href={linkExplorer} target='_blank'>
          deploy
        </a>
        .
      </PopupsModule>
      <PopupsModule
        isOpen={confirmModal}
        handleOpen={setConfirmModal}
        progress={false}
      >
        Your{' '}
        <a href={linkExplorer} target='_blank'>
          deploy
        </a>{' '}
        was successful.
      </PopupsModule>
      <ConnectionPopup
        isConnected={isConnected}
        isOpened={showConnectionPopup}
        onToggle={() => setShowConnectionPopup(!showConnectionPopup)}
        title='Connect your wallet to CasperSwap'
        onClose={() => setShowConnectionPopup(false)}
        onConnect={onConnectWallet}
        showButton={false}
      />
    </ConfigProviderContext.Provider>
  );
};
