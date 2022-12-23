# Liquidity Page

# Confirmation Process to create a token lp
- CSPR -> ERC20 : When you want to create a Liquidity Pair using a Casper token:
- - it selects the entry point internally (**add_liquidity_cspr**). 
- - After that, this contract will be saved in a special purse from Casper (this purse will be given by the server). 
- - - it uses the API entrypoint called **getWasmData** to get the last deploy performed at that purse.
- - After all of this, it shows the contract to be firm through Casper Signer. 
- - An internal process will be checking if the transaction state


- ERC20 -> ERC20 : 
- - it selects the **add_liquidity_js_client** entrypoint for ERC20 tokens.
- - when you perform operations between two ERC20 tokens, **you don't need to use a special purse** to save the tokens.
- - After all of this, it shows the contract to be firm through Casper Signer.
- - An internal process will be checking if the transaction state 

# Overall Flow

![img.png](../documentation/images/img.png)

##1º Wallet Connection
![img_1.png](../documentation/images/img_1.png)

##2º Select the token and insert a value in any input
![img_3.png](../documentation/images/img_3.png)
![img_2.png](../documentation/images/img_2.png)

##3º LP Detail will be shown, this detail contains the user liquidity pair that will be created
![img_4.png](../documentation/images/img_4.png)

##4º Before confirming the swap, you need to approve the ERC20 tokens.
![img.png](documentation/images/img_4_1.png)

##5º Firm the transaction from Casper Signer
![img_5.png](../documentation/images/img_5.png)

##6º Wait for successful transaction. You can also see the transaction link clicking *deploy*
![img_6.png](../documentation/images/img_6.png)

##7º After confirming the transaction, the user liquidity list will be updated and will appear next to the add liquidity box
![img_7.png](../documentation/images/img_7.png)

## UI Components

### The Liquidity Page
### Connection Wallet
### LP Detail
### Token Menu
### Liquidity Item