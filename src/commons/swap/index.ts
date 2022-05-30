import { AccessRights, CasperServiceByJsonRPC, CLAccountHash, CLByteArray, CLKey, CLList, CLPublicKey, CLString, CLValueBuilder, RuntimeArgs } from 'casper-js-sdk';
import { BASE_URL } from '../../constant';

const convertToStr=e=>e.toString();
export function createRecipientAddress(recipient) {
    if (recipient instanceof CLPublicKey) {
        return new CLKey(new CLAccountHash(recipient.toAccountHash()));
    } else {
        return new CLKey(recipient);
    }
};
export function createRuntimeArgs(amount_in,ROUTER_PACKAGE_HASH,amount_out_min,slippage,_paths,publicKey,mainPurse,deadline){
    return RuntimeArgs.fromMap({
        amount: CLValueBuilder.u512(convertToStr(amount_in)),
        destination_entrypoint: CLValueBuilder.string("swap_exact_cspr_for_tokens"),
        router_hash: new CLKey(new CLByteArray(Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex")))),
        amount_in: CLValueBuilder.u256(convertToStr(amount_in)),
        amount_out_min: CLValueBuilder.u256(
            convertToStr(amount_out_min - (amount_out_min * slippage) / 100)
        ),
        path: new CLList(_paths),
        to: createRecipientAddress(publicKey),
        purse: CLValueBuilder.uref(
            Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
            AccessRights.READ_ADD_WRITE
        ),
        deadline: CLValueBuilder.u256(deadline),
    })
}
async function getswapPath(tokenASymbol,tokenBSymbol){
    const params = {
        method:"POST",body:JSON.stringify({
        tokenASymbol: tokenASymbol,
        tokenBSymbol: tokenBSymbol,
})}
    const request = await fetch(`${BASE_URL}/getpath`,params)
    return await request.json()
}
async function swapMakeDeploy(publicKeyHex,deadline,paymentAmount,amount_in,amount_out_min,tokenASymbol,tokenBSymbol) {

        const publicKey = CLPublicKey.fromHex(publicKeyHex);
        let path = await getswapPath(tokenASymbol,tokenBSymbol);
        let _paths = [];
        for (let i = 0; i < path.length; i++) {
          const p = new CLString("hash-".concat(path[i]));
          _paths.push(p);
        }
        try {
          const runtimeArgs = createRuntimeArgs(
            amount_in,
            ROUTER_PACKAGE_HASH,
            amount_out_min,
            slippage,
            publicKey,
            deadline
          );

          let deploy = await makeDeployWasm(
            publicKey,
            runtimeArgs,
            paymentAmount
          );
          console.log("make deploy: ", deploy);
          try {
            if (selectedWallet === "Casper") {
              let signedDeploy = await signdeploywithcaspersigner(
                deploy,
                publicKeyHex
              );
              let result = await putdeploy(signedDeploy, enqueueSnackbar);
              console.log("result", result);
            }

            handleCloseSigning();
            let variant = "success";
            enqueueSnackbar("Tokens Swapped Successfully", { variant });
            setIsLoading(false);
            resetData();
            // window.location.reload(false);
          } catch {
            handleCloseSigning();
            let variant = "Error";
            enqueueSnackbar("Unable to Swap Tokens", { variant });
            setIsLoading(false);
          }
        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Input values are too large", { variant });
        }
      }
    }
  }
}
