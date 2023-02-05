import {ApolloClient, gql, HttpLink, InMemoryCache} from "@apollo/client";
import {INFO_SWAP_URL} from "../../constant";

const v2client = new ApolloClient({
  link: new HttpLink({
    uri: INFO_SWAP_URL,
  }),
  cache: new InMemoryCache(),
  //shouldBatch: true,
})


const PairFields = `
  fragment PairFields on Pair {
    id
    txCount
    token0 {
      id
      symbol
      name
      totalLiquidity
      derivedETH
    }
    token1 {
      id
      symbol
      name
      totalLiquidity
      derivedETH
    }
    reserve0
    reserve1
    reserveUSD
    totalSupply
    trackedReserveETH
    reserveETH
    volumeUSD
    untrackedVolumeUSD
    token0Price
    token1Price
    createdAtTimestamp
    createdAtBlockNumber
  }
`

export const PAIRS_BULK = gql`
  ${PairFields}
  query allpairs($allPairs: [String]!) {
    allpairs(first: 500, id: $allPairs) {
      ...PairFields
    }
  }
`

export const getPairData = async (pairList = []) => {
  try {
    const current = await v2client.query({
      query: PAIRS_BULK,
      variables: {
        allPairs: pairList,
      },
      fetchPolicy: 'cache-first',
    })

    return current.data.allpairs
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getUSDPairData = async (tokenASymbol, tokenBSymbol, tokenPairs) => {

  const aSymbol = tokenASymbol == 'CSPR' ? 'WCSPR' : tokenASymbol
  const bSymbol = tokenBSymbol == 'CSPR' ? 'WCSPR' : tokenBSymbol

  const packageLP = tokenPairs[`${aSymbol}-${bSymbol}`] != undefined ?
    tokenPairs[`${aSymbol}-${bSymbol}`] : tokenPairs[`${bSymbol}-${aSymbol}`]

  const data = await getPairData([packageLP.packageHash.substr(5)])

  if (data.length != 0) {
    const token = data[0]
    const map = new Map([
      ['CSPR', parseFloat(token.token0.name == 'WCSPR' ? token.token0Price : token.token1Price).toFixed(2)],
      [token.token0.symbol, parseFloat(token.token0Price).toFixed(2)],
      [token.token1.symbol, parseFloat(token.token1Price).toFixed(2)]
    ])
    return map
  } else {
    return new Map()
  }

}