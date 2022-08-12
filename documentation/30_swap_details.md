# Swap details

Parameters of swap trade

## Short view

### Exchange rate

Token A to Token B exchange rate and vice versa

Swap exchange rate calculated according to specified swap volume

```pool_exchange_rate = token_a_pool_size / token_b_pool_size```

```constant_product = token_a_pool_size * token_b_pool_size```

`constant_product` will be the same number before and after a trade occurs.

```new_token_a_pool_size = token_a_pool_size + token_a_paid```

```new_token_b_pool_size =  constant_product / new_token_a_pool_size```

```token_b_recieved = token_b_pool_size - new_token_b_pool_size```

```a_exchange_rate = token_b_recieved / token_a_paid``` Swap exchange rate 1 TokenA = X TokenB

```b_exchange_rate = token_a_paid / token_b_recieved``` Swap exchange rate 1 TokenB = X TokenA

#### SPIKE / NOTE

Currently on `async function calculateReserves` call we return `token_b_recieved` and `minimum_token_b_recieved`

https://github.com/Rengo-Labs/uniswap-casper-interface/blob/e544343368a268c2ba2792112f91483e77350106/src/contexts/ConfigContext/index.tsx#L112

## Full view

### Minimum received

Minimum Token B amount user will recieve, before transaction will be reverted.

Minimum recieved amount determinated by slippage settings.

Formula:

```minimum_token_b_recieved = (token_b_recieved - (token_b_recieved * slippage_tolerance) / 100)```

### Price impact

What is Price impact?
Price impact is the difference between the current market price and the price you will actually pay when performing a swap transaction on a decentralized exchange

```price_impact = ( b_exchange_ratec / pool_exchange_rate - 1 ) * 100```

### Slippage Tolerance

The maximum difference (in %) between your estimated price and executed price

Used to calculate minimum amount of Token B to recieve before transaction will be reverted

### Protocol fee (% token A)

Router protocol fee represented in Token A
- 0.3% of total Token A volume of swap transaction

Fee set globally for every token pair (pool)
Fee recipients:
- 0.25% Liquidity providers
- 0.05% Treasury

```protocol_fee = token_a_paid * 0.3 / 100```

```providers_fee = token_a_paid * 0.25 / 100```

```treasury_fee = token_a_paid * 0.05 / 100```

### Network gas fee

Swap transaction Casper network fee paid in CSPR and prederminated:

Swap + Approve = 10 000 000 000 motes (10 CSPR) 

7.39267 CSPR - we paid for transaction

Swap = 
