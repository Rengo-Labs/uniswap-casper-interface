import '@testing-library/jest-dom'
import {jest} from "@jest/globals";

jest.mock('axios', () => {})
jest.mock('@toruslabs/casper-embed', () => {})

jest.mock('../../../../commons/wallet/Client')
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