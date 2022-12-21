# Liquidity Page

# Confirmation Process to recover the tokens
- CSPR - ERC20 : 
- - the *remove_liquidity_cspr* entry point will be used for exchanging
- - it retrieves the purse (This contract hash is given by the server) to refund tokens to your wallet

- ERC20 - ERC20 : the *remove_liquidity_js_client* entry point will be used for exchanging
- - Firstly, we need to recover the contract hash using the package hash. 
For that reason, we need to use this endpoint: **[BASE_URL]/getContractHashAgainstPackageHash**
- - you don't need to use any purse to recover tokens because you already requested before when you retrieved the contract hash.

# Overall flow

##1º Wallet Connection
![img_1.png](../documentation/images/img_1.png)

##2º Select a user liquidity pair
![img.png](../documentation/images/img_7.png)

##3º Insert a value in any input; after that, you'll probably need to approve the token amount firstly
![img.png](../documentation/images/img_9.png)

##4º After approving the token amount, click *Remove Liquidity*
![img_2.png](../documentation/images/img_8.png)

##5º Confirm Liquidity Removing
![img_4.png](../documentation/images/img_10.png)

##7º Wait for successful transaction
![img_5.png](../documentation/images/img_12.png)

#8º Finally, if you remove all liquidity, an item should have been removed
![img_1.png](../documentation/images/img_13.png)

## UI Components

### The Liquidity Page
### Connection Wallet
### Liquidity Item
### Liquidity Removing