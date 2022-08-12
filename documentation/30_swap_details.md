# Swap details

Parameters of swap trade

## Short view

### Exchange rate

Token A to Token B exchange rate and vice versa

Formula: https://www.notion.so/Formula-Exchange-rate-formula-c326fa644d714834b0c27ce610398d3e

## Full view

### Swapping through

Router (venue) that gave the best price for this trade (swap)

### Minimum received

Minimum Token B amount user will recieve, before transaction will be reverted.

Minimum recieved amount determinated by slippage settings.

Formula:

```Minimum recieved = Estimated recieved * Slippage Tolerance```

### Price impact

Formula: https://www.notion.so/Formula-Price-impact-eac86f35c2474b93914c3424cab87c32

### Slippage Tolerance

The maximum difference (in %) between your estimated price and executed price

### Protocol fee (% token A)

Router protocol fee represented in Token A
- 0.3% of total Token A volume of swap transaction

Fee set globally for every token pair (pool)
Fee recipients:
- 0.25% Liquidity providers
- 0.05% Treasury

### Network gas fee

Casper network Swap transaction network fee in CSPR

Swap + Approve = 

Swap = 
