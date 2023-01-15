import React, {createContext, ReactNode, useState} from 'react'
import casprIcon from '../../../../assets/swapIcons/casperIcon.png'
import csxIcon from "../../../../assets/swapIcons/casperswap.png"
import wethIcon from '../../../../assets/swapIcons/wethIcon.svg'
import {initialConfigState} from "../../../../reducers";
import {PairData} from "../../../../reducers/PairsReducer";

export const PoolsProviderContext = createContext<any>({})

export const getTVLandVolume = () => {

  return {
    tvl: "192,168,000,000",
    totalVolume: "1,000,000"
  }
}

export const getPoolList = async () => {
  const pairData: PairData[] = [
    {
      allowance:"0",
      balance:"0",
      contract0:"03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
      contract1:"bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
      fees24h:"0",
      id:"c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485",
      liquidityUSD:"29.20",
      name:"WETH-CSX",
      oneYFees:"0",
      reserve0:"0",
      reserve1:"0",
      token0Icon: wethIcon,
      token0Name:"Wrapper Ether",
      token0Price:"0.093368384501801957",
      token0Symbol:"WETH",
      token1Icon: casprIcon,
      token1Name:"CasperSwap",
      token1Price:"10.710263493749327645",
      token1Symbol:"CSX",
      totalLiquidityUSD:"64422376981.990388499425767247908444526",
      totalReserve0:"561155317.000475353",
      totalReserve1:"6010121305.993522629",
      totalSupply:"1836368558.571696503",
      volume:"954.53904798872139073242",
      volume7d:"954.54"
    },
    {
      allowance:"0",
      balance:"0",
      contract0:"03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
      contract1:"bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
      fees24h:"0",
      id:"c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485",
      name:"WETH-WISER",
      oneYFees:"0",
      reserve0:"0",
      reserve1:"0",
      token0Icon: wethIcon,
      token0Name:"Wrapper Ether",
      token0Price:"0.093368384501801957",
      token0Symbol:"WETH",
      token1Icon: casprIcon,
      token1Name:"WISER",
      token1Price:"10.710263493749327645",
      token1Symbol:"WISER",
      totalLiquidityUSD:"64422376981.990388499425767247908444526",
      totalReserve0:"561155317.000475353",
      totalReserve1:"6010121305.993522629",
      totalSupply:"1836368558.571696503",
      volume:"954.53904798872139073242",
      volume7d:"954.54"
    },
    {
      allowance:"0",
      balance:"0",
      contract0:"03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
      contract1:"bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
      fees24h:"0",
      id:"c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485",
      name:"WETH-CSPR",
      oneYFees:"0",
      reserve0:"0",
      reserve1:"0",
      token0Icon: wethIcon,
      token0Name:"Wrapper Ether",
      token0Price:"0.093368384501801957",
      token0Symbol:"WETH",
      token1Icon: casprIcon,
      token1Name:"Casper",
      token1Price:"10.710263493749327645",
      token1Symbol:"CSPR",
      totalLiquidityUSD:"64422376981.990388499425767247908444526",
      totalReserve0:"561155317.000475353",
      totalReserve1:"6010121305.993522629",
      totalSupply:"1836368558.571696503",
      volume:"954.53904798872139073242",
      volume7d:"954.54"
    },
    {
      allowance:"0",
      balance:"0",
      contract0:"03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
      contract1:"bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
      fees24h:"0",
      id:"c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485",
      name:"WETH-SOL",
      oneYFees:"0",
      reserve0:"0",
      reserve1:"0",
      token0Icon: wethIcon,
      token0Name:"Wrapper Ether",
      token0Price:"0.093368384501801957",
      token0Symbol:"WETH",
      token1Icon: casprIcon,
      token1Name:"Solana",
      token1Price:"10.710263493749327645",
      token1Symbol:"CSX",
      totalLiquidityUSD:"64422376981.990388499425767247908444526",
      totalReserve0:"561155317.000475353",
      totalReserve1:"6010121305.993522629",
      totalSupply:"1836368558.571696503",
      volume:"954.53904798872139073242",
      volume7d:"954.54"
    },
    {
      allowance:"0",
      balance:"0",
      contract0:"03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
      contract1:"bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
      fees24h:"0",
      id:"c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485",
      name:"CSPR-DOT",
      oneYFees:"0",
      reserve0:"0",
      reserve1:"0",
      token0Icon: wethIcon,
      token0Name:"Casper",
      token0Price:"0.093368384501801957",
      token0Symbol:"WETH",
      token1Icon: casprIcon,
      token1Name:"Polka Dot",
      token1Price:"10.710263493749327645",
      token1Symbol:"DOT",
      totalLiquidityUSD:"64422376981.990388499425767247908444526",
      totalReserve0:"561155317.000475353",
      totalReserve1:"6010121305.993522629",
      totalSupply:"1836368558.571696503",
      volume:"954.53904798872139073242",
      volume7d:"954.54"
    }
  ]
  return pairData
}

export const loadPoolDetailByUser = async (hash) => {
  const pairData: PairData[] = [
    {
      allowance:"0",
      balance:"0",
      contract0:"03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
      contract1:"bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
      fees24h:"0",
      id:"c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485",
      name:"WETH-WISER",
      oneYFees:"0",
      reserve0:"0",
      reserve1:"0",
      token0Icon: wethIcon,
      token0Name:"Wrapper Ether",
      token0Price:"0.093368384501801957",
      token0Symbol:"WETH",
      token1Icon: casprIcon,
      token1Name:"WISER",
      token1Price:"10.710263493749327645",
      token1Symbol:"WISER",
      totalLiquidityUSD:"64422376981.990388499425767247908444526",
      totalReserve0:"561155317.000475353",
      totalReserve1:"6010121305.993522629",
      totalSupply:"1836368558.571696503",
      volume:"954.53904798872139073242",
      volume7d:"954.54"
    },
    {
      allowance:"355.961767477",
      balance:"336.101237135",
      contract0:"03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
      contract1:"bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
      fees24h:"0",
      id:"c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485",
      liquidityUSD:"29.20",
      name:"WETH-CSX",
      oneYFees:"0",
      reserve0:"0.254316795",
      reserve1:"2.72379888",
      token0Icon:"/static/media/wethIcon.b4c751993b15ca6b24ea5dc415ca7d75.svg",
      token0Name:"Wrapper Ether",
      token0Price:"0.093368384501801957",
      token0Symbol:"WETH",
      token1Icon: csxIcon,
      token1Name:"CasperSwap",
      token1Price:"10.710263493749327645",
      token1Symbol:"CSX",
      totalLiquidityUSD:"64422376981.990388499425767247908444526",
      totalReserve0:"561155317.000475353",
      totalReserve1:"6010121305.993522629",
      totalSupply:"1836368558.571696503",
      volume:"954.53904798872139073242",
      volume7d:"954.54"
    },
    {
      allowance:"0",
      balance:"0",
      contract0:"03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
      contract1:"bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
      fees24h:"0",
      id:"c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485",
      name:"WETH-CSPR",
      oneYFees:"0",
      reserve0:"0",
      reserve1:"0",
      token0Icon: wethIcon,
      token0Name:"Wrapper Ether",
      token0Price:"0.093368384501801957",
      token0Symbol:"WETH",
      token1Icon: casprIcon,
      token1Name:"Casper",
      token1Price:"10.710263493749327645",
      token1Symbol:"CSPR",
      totalLiquidityUSD:"64422376981.990388499425767247908444526",
      totalReserve0:"561155317.000475353",
      totalReserve1:"6010121305.993522629",
      totalSupply:"1836368558.571696503",
      volume:"954.53904798872139073242",
      volume7d:"954.54"
    },
    {
      allowance:"0",
      balance:"0",
      contract0:"03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
      contract1:"bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
      fees24h:"0",
      id:"c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485",
      name:"WETH-SOL",
      oneYFees:"0",
      reserve0:"0",
      reserve1:"0",
      token0Icon: wethIcon,
      token0Name:"Wrapper Ether",
      token0Price:"0.093368384501801957",
      token0Symbol:"WETH",
      token1Icon: casprIcon,
      token1Name:"Solana",
      token1Price:"10.710263493749327645",
      token1Symbol:"CSX",
      totalLiquidityUSD:"64422376981.990388499425767247908444526",
      totalReserve0:"561155317.000475353",
      totalReserve1:"6010121305.993522629",
      totalSupply:"1836368558.571696503",
      volume:"954.53904798872139073242",
      volume7d:"954.54"
    },
    {
      allowance:"0",
      balance:"0",
      contract0:"03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
      contract1:"bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
      fees24h:"0",
      id:"c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485",
      name:"CSPR-DOT",
      oneYFees:"0",
      reserve0:"0",
      reserve1:"0",
      token0Icon: wethIcon,
      token0Name:"Casper",
      token0Price:"0.093368384501801957",
      token0Symbol:"WETH",
      token1Icon: casprIcon,
      token1Name:"Polka Dot",
      token1Price:"10.710263493749327645",
      token1Symbol:"DOT",
      totalLiquidityUSD:"64422376981.990388499425767247908444526",
      totalReserve0:"561155317.000475353",
      totalReserve1:"6010121305.993522629",
      totalSupply:"1836368558.571696503",
      volume:"954.53904798872139073242",
      volume7d:"954.54"
    }
  ]
  return pairData
}

export function getColumns() {
  return [
    {
      id: 1,
      Header: 'Pool',
      accessor: 'tokeIcon',
      Cell: (tableProps:any) => (
          <img
              src={tableProps.row.original.tokeIcon}
              width={25}
              alt='Token Icon'
          />
      )
    },
    {
      id: 2,
      Header: 'Liquidity',
      accessor: 'tokenLiquidity',
    },
    {
      id: 3,
      Header: 'Volume 7D',
      accessor: 'volume24h',
    },
    {
      id: 4,
      Header: 'Fees 7d',
      accessor: 'volume7d',
    },
    {
      id: 5,
      Header: 'APR 7D',
      accessor: 'fees24h',
    }
  ]
}

export const onRemoveLiquidity = async () => {

}

export const onIncreaseAllow = async () => {

}


export const PoolsContext = ({ children }:{children:ReactNode}) => {
  const [gralData, setGralData] = useState(getTVLandVolume())

  const headers = getColumns()
  const columns = React.useMemo(() => headers, [])

  return (
    <PoolsProviderContext.Provider value={{
      gralData,
      columns,
      getPoolList,
      loadPoolDetailByUser,
      onRemoveLiquidity,
      onIncreaseAllow,
      configState: initialConfigState
    }}>
      {children}
    </PoolsProviderContext.Provider>
  )
}
