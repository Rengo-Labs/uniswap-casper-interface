import '@testing-library/jest-dom'
import {jest} from "@jest/globals";
import {notificationStore} from "../../../../store/store";

jest.mock("../../../../commons/wallet/types", () => {
  return { Network: {CASPER_TESTNET: ""}, WalletName: {CASPER_SIGNER : ""} }
})
jest.mock("axios", () => {
  return {post: () => { return {data: {
        success: true,
        reserve0: "1000000",
        reserve1: "2000000"
      }}}}
})
jest.mock("@toruslabs/casper-embed", () => {})
jest.mock('../../../../commons/wallet/Client')
jest.mock('../../../../store/store', () => {
  return {
    notificationStore: () => {
      return {
        updateNotification: () => {

        },
        dismissNotification: () => {

        }
      }
    }
  }
})
jest.mock("../../../../commons/utils/index")
jest.mock("../../../../commons/deploys/addLiquidity", () => {
  return {signAndDeployAddLiquidity: (apiClient, casperClient, wallet, deadline,
                                      amountADesired, amountBDesired, tokenA, tokenB,
                                      slippage, mainPurse, gasFee) => {
      return ["hash liquidity", {} as any]
    }
  }
})
jest.mock("../../../../commons/deploys/removeLiquidity", () => {
  return {signAndDeployRemoveLiquidity: (apiClient, casperClient,
                                         wallet, deadline, liquidity, amountADesired,
                                         amountBDesired, tokenA, tokenB, slippage) => {
      return ["hash remove", {} as any]
    }
  }
})

