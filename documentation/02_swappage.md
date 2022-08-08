# Swap Page

## UI Components

### Swap headers

header contain a menu nav for all pages

* Swap
* Liquidity
* Pools
* Tokens

![Swap Header](images/02_header.png)

### Swap Body

this is the main component in swap.

![Swap Header](images/02_body.png)

button connect wallet triggers two process.

* [Login Process](20_login.md)
* [GetBalance Process](20_getbalance.md)

then with those state updated show to user balance in him wallet

![Swap Connection](images/02_swapconnect.png)

when user click on Token Icon page show a new modal

![Token Modal](images/02_tokenModal.png)

in there user can select a new token for swap, this modal is feed for Token state.

both button have the same behavior, but when you click on token B selection the list is filtered for first token

![Token Modal B](images/02_tokenModalB.png)

