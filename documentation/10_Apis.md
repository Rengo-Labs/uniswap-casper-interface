# APIS from CasperSwap

BASE URL =
http://graphqlbackendfinalized-env.eba-n4mfh6c2.us-east-1.elasticbeanstalk.com

## Token list

METHOD: GET

{{BASE_URL}}/tokensList

returns all tokens there's on the server.

response

```json
{
  "name": "Casper Token List",
  "version": {
    "major": 0,
    "minor": 2,
    "patch": 0
  },
  "keywords": ["casper", "tokens", "trusted"],
  "logoURI": "https://gemini.com/static/images/loader.png",
  "timestamp": "2021-03-23T14:15:22+0000",
  "tokens": [
    {
      "name": "Coinstox",
      "chainId": 1,
      "symbol": "CSX",
      "decimals": 9,
      "contractHash": "hash-5240db456a1a2cb63cabcdebb86a5177d0e9ceddab7a737b3bd90caeae33e80e",
      "packageHash": "hash-bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
      "logoURI": "https://static.coincost.net/logo/cryptocurrency/coinstox.png"
    },
    {
      "name": "Wrapper Ether",
      "chainId": 1,
      "symbol": "WETH",
      "decimals": 9,
      "contractHash": "hash-9aef66efbac45daf71f92f3446422a00fd3adaaf206a1c29d80f26bc513c105d",
      "packageHash": "hash-03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
      "logoURI": "https://www.gemini.com/images/currencies/icons/default/eth.svg"
    },
    {
      "name": "Wrapper Casper",
      "chainId": 1,
      "symbol": "WCSPR",
      "decimals": 9,
      "contractHash": "hash-238834bc76aed9e18ad0260e65d2ef751999c97c13da92dee83bd511e31e2d2d",
      "packageHash": "hash-afcaa550ebb63266fb2752b58ecd7e8fcd78e0a75777ecd57045213a013d9813",
      "logoURI": "https://miro.medium.com/max/3150/2*_dAX3saw1HVtj15WEJClHA.png"
    }
  ]
}
```

# Get Path

METHOD: POST

{{BASE_URL}}/getpath

retrieves the contract hash of a token pair.

Request body

```json
{
  "tokenASymbol": "WETH",
  "tokenBSymbol": "WCSPR"
}
```

Response

```json
{
  "success": true,
  "message": "Path found against these tokens.",
  "path": ["WETH", "WCSPR"],
  "pathwithcontractHash": [
    "03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
    "afcaa550ebb63266fb2752b58ecd7e8fcd78e0a75777ecd57045213a013d9813"
  ]
}
```

## Get Path Reserves

METHOD: POST

{{BASE_URL}}/getpathreserves

returns the current reserve/liquidity of a token pair. It's used to using to calculate minimum receive of tokens.

Request body

```json
{
  "path": ["WCSPR", "WETH"]
}
```

Response

```json
{
  "success": true,
  "message": "Reserves have been calculated.",
  "reserve0": 0.037762211852053015,
  "reserve1": 26.481499651499707
}
```

## Get Pair List

METHOD: GET

{{BASE_URL}}/getpairlist

returns all general information of every token pair

Response

```json
{
  "success": true,
  "message": "Pair List: ",
  "pairList": [
    {
      "token0": {
        "id": "03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
        "name": "Wrapper Ether",
        "symbol": "WETH",
        "totalLiquidity": "0",
        "derivedETH": "0"
      },
      "token1": {
        "id": "bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
        "name": "Coinstox",
        "symbol": "CSX",
        "totalLiquidity": "0",
        "derivedETH": "0"
      },
      "_id": "6257f38998e291d6db34f99c",
      "id": "c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485",
      "reserve0": "9994197276842",
      "reserve1": "106618067565089",
      "totalSupply": "32607986941192",
      "reserveETH": "0",
      "reserveUSD": "0",
      "trackedReserveETH": "0",
      "token0Price": "0",
      "token1Price": "10",
      "volumeToken0": "303924550717",
      "volumeToken1": "3149021000000",
      "volumeUSD": "0",
      "untrackedVolumeUSD": "0",
      "txCount": "35",
      "createdAtTimestamp": 1649931075,
      "createdAtBlockNumber": "ddeb70a3be2aa70c9ef6d679f93c93e48b59758a6d0d153bafb10e57d008d225",
      "liquidityProviderCount": "7",
      "__v": 0
    },
    {
      "token0": {
        "id": "afcaa550ebb63266fb2752b58ecd7e8fcd78e0a75777ecd57045213a013d9813",
        "name": "Wrapped Casper",
        "symbol": "WCSPR",
        "totalLiquidity": "0",
        "derivedETH": "0"
      },
      "token1": {
        "id": "bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
        "name": "Coinstox",
        "symbol": "CSX",
        "totalLiquidity": "101752566065080",
        "derivedETH": "0"
      },
      "_id": "625d6163e3f87761a9fe061f",
      "id": "a84382872d1402a5ec8d8453f516586166100d8252f997b0bcdeed8c4737588d",
      "reserve0": "98823032294",
      "reserve1": "9813186401510",
      "totalSupply": "25111975969",
      "reserveETH": "0",
      "reserveUSD": "0",
      "trackedReserveETH": "0",
      "token0Price": "0",
      "token1Price": "99",
      "volumeToken0": "311052930",
      "volumeToken1": "30892233306",
      "volumeUSD": "0",
      "untrackedVolumeUSD": "0",
      "txCount": "13",
      "createdAtTimestamp": 1650286879,
      "createdAtBlockNumber": "658126ad6ec78842ef30e8d607894a17abcb2f3f0d74c6991c6f7f6bf43515e8",
      "liquidityProviderCount": "3",
      "__v": 0
    },
    {
      "token0": {
        "id": "03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
        "name": "Wrapper Ether",
        "symbol": "WETH",
        "totalLiquidity": "10017924743324",
        "derivedETH": "0"
      },
      "token1": {
        "id": "afcaa550ebb63266fb2752b58ecd7e8fcd78e0a75777ecd57045213a013d9813",
        "name": "Wrapped Casper",
        "symbol": "WCSPR",
        "totalLiquidity": "1000000000",
        "derivedETH": "0"
      },
      "_id": "625d640ee3f87761a9fe06a7",
      "id": "cb0f9f291ae73928b739c90c03eca70cd610d945304ea606fe4adced3fa07060",
      "reserve0": "8957056998",
      "reserve1": "237196301771",
      "totalSupply": "11139827979",
      "reserveETH": "0",
      "reserveUSD": "0",
      "trackedReserveETH": "0",
      "token0Price": "0",
      "token1Price": "26",
      "volumeToken0": "106587737851",
      "volumeToken1": "122001000030",
      "volumeUSD": "0",
      "untrackedVolumeUSD": "0",
      "txCount": "12",
      "createdAtTimestamp": 1650287562,
      "createdAtBlockNumber": "3bd29e1fa41dbb86581e1f4022b181e233e23099d3ba3695342a7faeb72bd4eb",
      "liquidityProviderCount": "5",
      "__v": 0
    }
  ]
}
```

## Get Pair Against User

METHOD: POST

{{BASE_URL}}/getpairagainstuser

retrieves all user liquidity pair which were created previously.
it contains two important fields:
- userpairs has the current user reserve/liquidity of every token which is part of a liquidity pair
- pairsdata has general information of operations of every token pair

Request body

```json
{ "user": "6bc21d981ab85c81b765879b74c70832551e1c2b83f149f6e8ac7fc54a74df40" }
```

Response

```json
{
  "success": true,
  "message": "This User has added liquidity against following pairs.",
  "userpairs": [
    {
      "_id": "638b52b556918146742bf875",
      "id": "6bc21d981ab85c81b765879b74c70832551e1c2b83f149f6e8ac7fc54a74df40",
      "pair": "cb0f9f291ae73928b739c90c03eca70cd610d945304ea606fe4adced3fa07060",
      "reserve0": "2636860956",
      "reserve1": "1000000000000",
      "__v": 0
    },
    {
      "_id": "638b539b56918146742bf934",
      "id": "6bc21d981ab85c81b765879b74c70832551e1c2b83f149f6e8ac7fc54a74df40",
      "pair": "a84382872d1402a5ec8d8453f516586166100d8252f997b0bcdeed8c4737588d",
      "reserve0": "99999999999",
      "reserve1": "8648950308724",
      "__v": 0
    }
  ],
  "pairsdata": [
    {
      "token0": {
        "id": "03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
        "name": "Wrapper Ether",
        "symbol": "WETH",
        "totalLiquidity": "10017924743324",
        "derivedETH": "0"
      },
      "token1": {
        "id": "afcaa550ebb63266fb2752b58ecd7e8fcd78e0a75777ecd57045213a013d9813",
        "name": "Wrapped Casper",
        "symbol": "WCSPR",
        "totalLiquidity": "1000000000",
        "derivedETH": "0"
      },
      "_id": "625d640ee3f87761a9fe06a7",
      "id": "cb0f9f291ae73928b739c90c03eca70cd610d945304ea606fe4adced3fa07060",
      "reserve0": "143729057065",
      "reserve1": "54567544899202",
      "totalSupply": "2729235713182",
      "reserveETH": "109135089798403.999999986821892525",
      "reserveUSD": "3236000333791.196933708225288946062813536758015825",
      "trackedReserveETH": "109135089798403.999999986821892525",
      "token0Price": "0.002633965983452224",
      "token1Price": "379.655624363585606885",
      "volumeToken0": "131720555487",
      "volumeToken1": "7911274624029",
      "volumeUSD": "171432916324.433339970951682277",
      "untrackedVolumeUSD": "248229757874.979887919500238833629777798902622164",
      "txCount": "180",
      "createdAtTimestamp": 1650287562,
      "createdAtBlockNumber": "3bd29e1fa41dbb86581e1f4022b181e233e23099d3ba3695342a7faeb72bd4eb",
      "liquidityProviderCount": "23",
      "__v": 0
    },
    {
      "token0": {
        "id": "afcaa550ebb63266fb2752b58ecd7e8fcd78e0a75777ecd57045213a013d9813",
        "name": "Wrapped Casper",
        "symbol": "WCSPR",
        "totalLiquidity": "0",
        "derivedETH": "0"
      },
      "token1": {
        "id": "bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
        "name": "Coinstox",
        "symbol": "CSX",
        "totalLiquidity": "101752566065080",
        "derivedETH": "0"
      },
      "_id": "625d6163e3f87761a9fe061f",
      "id": "a84382872d1402a5ec8d8453f516586166100d8252f997b0bcdeed8c4737588d",
      "reserve0": "10650895101994",
      "reserve1": "921190624805875",
      "totalSupply": "98081277535239",
      "reserveETH": "21301790203987.999547373498293125",
      "reserveUSD": "635166281847.36716333613535898769982434439991250",
      "trackedReserveETH": "21301790203987.999547373498293125",
      "token0Price": "0.011562096720468135",
      "token1Price": "86.489503087248970356",
      "volumeToken0": "458985212512",
      "volumeToken1": "41237556822898",
      "volumeUSD": "10574738492.774830770502314136",
      "untrackedVolumeUSD": "13878891463.770144892831344009850182711735811637",
      "txCount": "84",
      "createdAtTimestamp": 1650286879,
      "createdAtBlockNumber": "658126ad6ec78842ef30e8d607894a17abcb2f3f0d74c6991c6f7f6bf43515e8",
      "liquidityProviderCount": "14",
      "__v": 0
    }
  ]
}
```

## Liquidity Agains User And Pair

METHOD: POST

{{BASE_URL}}/liquidityagainstuserandpair

retrieves the current amount token of the user liquidity pair 

Request body

```json
{
  "to": "b435c66fd1423dba514af2015b43eeceae8bf71f4b201ac379934400b74bc02d",
  "pairid": "cb0f9f291ae73928b739c90c03eca70cd610d945304ea606fe4adced3fa07060"
}
```

Response

```json
{
  "success": true,
  "message": "Liquidity has been found against this user against passed pair ",
  "liquidity": "2619740748"
}
```

## Blanace Against User

METHOD: POST

{{BASE_URL}}/balanceagainstuser

returns the current balance of contracts of a wallet

Request body

```json
{
  "contractHash": "5240db456a1a2cb63cabcdebb86a5177d0e9ceddab7a737b3bd90caeae33e80e",
  "user": "Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString(hex)"
}
```

Response

```json
{
  "success": true,
  "message": "Balance has been found against this user against passed token ",
  "balance": "0"
}
```

METHOD: POST

{{BASE_URL}}/getContractHashAgainstPackageHash

retrieves the contract hash using the package hash from user liquidity pair (pairsdata -> id)

Request body
````json
{
  "packageHash": "c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485"
}
````

Response
````json
{
  "success": true,
  "message": "Contract Hash has been Succefully found.",
  "Data": {
    "_id": "6257e8c56893e20ed531c2f5",
    "contractHash": "c8920a5b01ecb1b3946f05dd712d41164611f7726952bba360c8b953edc01779",
    "packageHash": "c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485",
    "__v": 0
  }
}
````
