import { AccessRights, CLByteArray, CLKey, CLOption, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { createRecipientAddress } from "../../../commons/swap";
import { ROUTER_CONTRACT_HASH } from "../../../constant";

function convertToStr(a){
    return a.toString()
}

function createRuntimeeArgsPool(token_AAmount,_token_b,token_BAmount,slippage,publicKey,mainPurse,deadline,pair,ROUTER_PACKAGE_HASH){
    return RuntimeArgs.fromMap({
        amount: CLValueBuilder.u512(convertToStr(token_AAmount)),
        destination_entrypoint: CLValueBuilder.string("add_liquidity_cspr"),
        token: new CLKey(_token_b),
        amount_cspr_desired: CLValueBuilder.u256(convertToStr(token_AAmount)),
        amount_token_desired: CLValueBuilder.u256(convertToStr(token_BAmount)),
        amount_cspr_min: CLValueBuilder.u256(convertToStr(Number(token_AAmount - (token_AAmount * slippage) / 100).toFixed(9))),
        amount_token_min: CLValueBuilder.u256(convertToStr(Number(token_BAmount - (token_BAmount * slippage) / 100).toFixed(9))),
        to: createRecipientAddress(publicKey),
        purse: CLValueBuilder.uref(
            Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
            AccessRights.READ_ADD_WRITE
        ),
        deadline: CLValueBuilder.u256(deadline),
        pair: new CLOption(Some(new CLKey(pair))),
        router_hash: new CLKey(new CLByteArray(Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex")))),
    });
}
async function addLiquidityMakeDeploy(activePublicKey,tokenA,tokenB,tokenAAmount,tokenBAmount,slippage,mainPurse,ROUTER_PACKAGE_HASH) {
    const publicKeyHex = activePublicKey;
    if (
        publicKeyHex !== null &&
        publicKeyHex !== "null" &&
        publicKeyHex !== undefined
    ) {
        const publicKey = CLPublicKey.fromHex(publicKeyHex);
        const caller = ROUTER_CONTRACT_HASH;
        const tokenAAddress = tokenA?.packageHash;
        const tokenBAddress = tokenB?.packageHash;
        const token_AAmount = tokenAAmount;
        const token_BAmount = tokenBAmount;
        const deadline = 1739598100811;
        const paymentAmount = 10000000000;

        if (tokenA.name === "Casper") {
            const _token_b = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
            );
            const pair = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
            );
            try {
                console.log("tokenA.name", tokenA.name);
                const runtimeArgs = createRuntimeeArgsPool(token_AAmount,_token_b,token_BAmount,slippage,publicKey,mainPurse,deadline,pair,ROUTER_PACKAGE_HASH)
                // Set contract installation deploy (unsigned).
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
                        // console.log("result", result);
                    } else {
                        // let Torus = new Torus();
                        torus = new Torus();
                        console.log("torus", torus);
                        await torus.init({
                            buildEnv: "testing",
                            showTorusButton: true,
                            network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
                        });
                        console.log("Torus123", torus);
                        console.log("torus", torus.provider);
                        const casperService = new CasperServiceByJsonRPC(torus?.provider);
                        const deployRes = await casperService.deploy(deploy);
                        console.log("deployRes", deployRes.deploy_hash);
                        console.log(
                            `... Contract installation deployHash: ${deployRes.deploy_hash}`
                        );
                        let result = await getDeploy(
                            NODE_ADDRESS,
                            deployRes.deploy_hash,
                            enqueueSnackbar
                        );
                        console.log(
                            `... Contract installed successfully.`,
                            JSON.parse(JSON.stringify(result))
                        );
                        console.log("result", result);
                    }
                    setTokenAAllowance(0);
                    setTokenBAllowance(0);
                    setTokenAAmount(0);
                    setTokenBAmount(0);
                    getCurrencyBalance();
                    handleCloseSigning();
                    let variant = "success";
                    enqueueSnackbar("Liquidity Added Successfully", { variant });
                    setIsLoading(false);
                    resetData();
                } catch {
                    handleCloseSigning();
                    let variant = "Error";
                    enqueueSnackbar("Unable to Add Liquidity", { variant });
                    setIsLoading(false);
                }
            } catch {
                handleCloseSigning();
                let variant = "Error";
                enqueueSnackbar("Input values are not Valid", { variant });
                setIsLoading(false);
            }
        } else if (tokenB.name === "Casper") {
            const _token_a = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenAAddress.slice(5), "hex"))
            );
            try {
                const runtimeArgs = RuntimeArgs.fromMap({
                    amount: CLValueBuilder.u512(convertToStr(token_BAmount)),
                    destination_entrypoint: CLValueBuilder.string("add_liquidity_cspr"),
                    token: new CLKey(_token_a),
                    amount_cspr_desired: CLValueBuilder.u256(
                        convertToStr(token_BAmount)
                    ),
                    amount_token_desired: CLValueBuilder.u256(
                        convertToStr(token_AAmount)
                    ),
                    amount_cspr_min: CLValueBuilder.u256(convertToStr(Number(token_BAmount - (token_BAmount * slippage) / 100).toFixed(9))),
                    amount_token_min: CLValueBuilder.u256(convertToStr(Number(token_AAmount - (token_AAmount * slippage) / 100).toFixed(9))),
                    to: createRecipientAddress(publicKey),
                    purse: CLValueBuilder.uref(
                        Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
                        AccessRights.READ_ADD_WRITE
                    ),
                    deadline: CLValueBuilder.u256(deadline),
                    pair: new CLOption(Some(new CLKey(_token_a))),
                    router_hash: new CLKey(new CLByteArray(Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex")))),
                });
                // Set contract installation deploy (unsigned).
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
                    } else {
                        // let Torus = new Torus();
                        torus = new Torus();
                        console.log("torus", torus);
                        await torus.init({
                            buildEnv: "testing",
                            showTorusButton: true,
                            network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
                        });
                        console.log("Torus123", torus);
                        console.log("torus", torus.provider);
                        const casperService = new CasperServiceByJsonRPC(torus?.provider);
                        const deployRes = await casperService.deploy(deploy);
                        console.log("deployRes", deployRes.deploy_hash);
                        console.log(
                            `... Contract installation deployHash: ${deployRes.deploy_hash}`
                        );
                        let result = await getDeploy(
                            NODE_ADDRESS,
                            deployRes.deploy_hash,
                            enqueueSnackbar
                        );
                        console.log(
                            `... Contract installed successfully.`,
                            JSON.parse(JSON.stringify(result))
                        );
                        console.log("result", result);
                    }
                    setTokenAAllowance(0);
                    setTokenBAllowance(0);
                    setTokenAAmount(0);
                    setTokenBAmount(0);
                    getCurrencyBalance();
                    handleCloseSigning();
                    let variant = "success";
                    enqueueSnackbar("Liquidity Added Successfully", { variant });
                    setIsLoading(false);
                    resetData();
                } catch {
                    handleCloseSigning();
                    let variant = "Error";
                    enqueueSnackbar("Unable to Add Liquidity", { variant });
                    setIsLoading(false);
                }
            } catch {
                handleCloseSigning();
                let variant = "Error";
                enqueueSnackbar("Input values are too large", { variant });
                setIsLoading(false);
            }
        } else {
            // eslint-disable-next-line
            console.log("token_AAmount", (token_AAmount - (token_AAmount * slippage) / 100).toFixed(9));
            console.log("token_BAmount", token_BAmount - (token_BAmount * slippage) / 100);
            const _token_a = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenAAddress.slice(5), "hex"))
            );
            const _token_b = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
            );
            const pair = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
            );
            // try {
            const runtimeArgs = RuntimeArgs.fromMap({
                token_a: new CLKey(_token_a),
                token_b: new CLKey(_token_b),
                amount_a_desired: CLValueBuilder.u256(convertToStr(token_AAmount)),
                amount_b_desired: CLValueBuilder.u256(convertToStr(token_BAmount)),
                amount_a_min: CLValueBuilder.u256(convertToStr(Number(token_AAmount - (token_AAmount * slippage) / 100).toFixed(9))),
                amount_b_min: CLValueBuilder.u256(convertToStr(Number(token_BAmount - (token_BAmount * slippage) / 100).toFixed(9))),
                to: createRecipientAddress(publicKey),
                deadline: CLValueBuilder.u256(deadline),
                pair: new CLOption(Some(new CLKey(pair))),
            });

            let contractHashAsByteArray = Uint8Array.from(
                Buffer.from(caller, "hex")
            );
            let entryPoint = "add_liquidity_js_client";

            // Set contract installation deploy (unsigned).
            let deploy = await makeDeploy(
                publicKey,
                contractHashAsByteArray,
                entryPoint,
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
                } else {
                    // let Torus = new Torus();
                    torus = new Torus();
                    console.log("torus", torus);
                    await torus.init({
                        buildEnv: "testing",
                        showTorusButton: true,
                        network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
                    });
                    console.log("Torus123", torus);
                    console.log("torus", torus.provider);
                    const casperService = new CasperServiceByJsonRPC(torus?.provider);
                    const deployRes = await casperService.deploy(deploy);
                    console.log("deployRes", deployRes.deploy_hash);
                    console.log(
                        `... Contract installation deployHash: ${deployRes.deploy_hash}`
                    );
                    let result = await getDeploy(
                        NODE_ADDRESS,
                        deployRes.deploy_hash,
                        enqueueSnackbar
                    );
                    console.log(
                        `... Contract installed successfully.`,
                        JSON.parse(JSON.stringify(result))
                    );
                    console.log("result", result);
                }
                let variant = "success";

                handleCloseSigning();
                enqueueSnackbar("Liquidity Added Successfully", { variant });
                setIsLoading(false);
                resetData();
            } catch {
                handleCloseSigning();
                let variant = "Error";
                enqueueSnackbar("Unable to Add Liquidity", { variant });
                setIsLoading(false);
            }
            // } catch {
            //   handleCloseSigning();
            //   let variant = "Error";
            //   enqueueSnackbar("Input values are too large", { variant });
            //   setIsLoading(false);
            // }
        }
    } else {
        handleCloseSigning();
        let variant = "error";
        enqueueSnackbar("Connect to Wallet Please", { variant });
        setIsLoading(false);
    }
}