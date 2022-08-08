# Process in casperSwap

login process sequence diagram

![Login](images/loginsigner.png)

https://sequencediagram.org/


```
title Login CasperSigner

User->Casper Page:Click button "Connect Wallet"
Casper Page-->CasperSDK: getWalletAddress()
CasperSDK-->CasperSigner: getWalletAddress()
CasperSDK<--CasperSigner: return wallet address
Casper Page<--CasperSDK: return wallet address
Casper Page-->Casper Page: store address
Casper Page->User:Show notification success

```


