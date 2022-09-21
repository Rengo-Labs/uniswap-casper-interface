import { AccessRights, CasperServiceByJsonRPC, CLByteArray, CLKey, CLList, CLPublicKey, CLString, CLValueBuilder, RuntimeArgs } from 'casper-js-sdk';
import { DeployUtil, Signer } from 'casper-js-sdk';
export const uri = `https://v2casperswapgraphqlbackend-env.eba-npfjx8q6.us-east-1.elasticbeanstalk.com/`
export const ROUTER_CONTRACT_HASH="2bd3b33f9d0a137a5790ebf0091d6bb5e0f47df6b7ca783989df8490c35875c7"
const [openSigning, setOpenSigning] = useState(false);
let [isLoading, setIsLoading] = useState(false);
let [tokenAAmount, setTokenAAmount] = useState(0);
let [tokenBAmount, setTokenBAmount] = useState(0);

const [swapPath, setSwapPath] = useState([])

const handleShowSigning = () => {
    setOpenSigning(true);
};
const handleCloseSigning = () => {
    setOpenSigning(false);
  };

export async function makeDeployWasm(publicKey, runtimeArgs, paymentAmount) {
    let wasmData = await axios.get('/getWasmData')
    console.log("wasmData.data.wasmData", wasmData.data.wasmData.data);
    console.log("new Uint8Array(wasmData.data.wasmData.data)", new Uint8Array(wasmData.data.wasmData.data));
    let deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(
            publicKey,
            'casper-test'
        ),
        DeployUtil.ExecutableDeployItem.newModuleBytes(
            new Uint8Array(wasmData.data.wasmData.data),
            runtimeArgs
        ),
        DeployUtil.standardPayment(
            paymentAmount
        )
    );
    return deploy
}
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


export async function signdeploywithcaspersigner(deploy, publicKeyHex) {
    let deployJSON = DeployUtil.deployToJson(deploy);
    console.log("deployJSON: ", deployJSON);    
    let signedDeployJSON = await Signer.sign(deployJSON, publicKeyHex, publicKeyHex);
    let signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();
    return signedDeploy;
}

async function swapMakeDeploy() {
    handleShowSigning();
    setIsLoading(true);
    const publicKeyHex = activePublicKey;
    if (
        publicKeyHex !== null &&
        publicKeyHex !== "null" &&
        publicKeyHex !== undefined
    ) {
        const deadline = 1739598100811;
        const paymentAmount = 10_000_000_000;
        if (inputSelection === "tokenA") {
            if (tokenA.name === "Casper") {
                console.log("swap_exact_cspr_for_token");
                const publicKey = CLPublicKey.fromHex(publicKeyHex);
                const caller = ROUTER_CONTRACT_HASH;
                const amount_in = tokenAAmount;
                const amount_out_min = tokenBAmount;

                console.log("publicKeyHex", publicKeyHex);
                let path = swapPath;
                console.log("path", path);
                let _paths = [];
                for (let i = 0; i < path.length; i++) {
                    const p = new CLString("hash-".concat(path[i]));
                    _paths.push(p);
                }
                console.log("_paths", _paths);
                try {
                    const runtimeArgs = createRuntimeArgs(amount_in,ROUTER_PACKAGE_HASH,amount_out_min,slippage,publicKey,deadline)

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
            } else if (tokenB.name === "Casper") {
                console.log("swap_exact_token_for_cspr");
                const publicKey = CLPublicKey.fromHex(publicKeyHex);
                const caller = ROUTER_CONTRACT_HASH;
                const amount_in = tokenAAmount;
                const amount_out_min = tokenBAmount;

                console.log("publicKeyHex", publicKeyHex);
                let path = swapPath;
                console.log("path", path);
                let _paths = [];
                for (let i = 0; i < path.length; i++) {
                    const p = new CLString("hash-".concat(path[i]));
                    _paths.push(p);
                }
                console.log("_paths", _paths);
                console.log("mainPurse", mainPurse);
                console.log(
                    "mainPurse",
                    Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex"))
                );
                try {
                    const runtimeArgs = RuntimeArgs.fromMap({
                        amount: CLValueBuilder.u512(convertToStr(amount_in)),
                        destination_entrypoint: CLValueBuilder.string("swap_exact_tokens_for_cspr"),
                        router_hash: new CLKey(new CLByteArray(Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex")))),
                        amount_in: CLValueBuilder.u256(convertToStr(amount_in)),
                        amount_out_min: CLValueBuilder.u256(
                            convertToStr(amount_out_min - (amount_out_min * slippage) / 100)
                        ),
                        path: new CLList(_paths),
                        to: CLValueBuilder.uref(
                            Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
                            AccessRights.READ_ADD_WRITE
                        ),
                        deadline: CLValueBuilder.u256(deadline),
                    });

                    let contractHashAsByteArray = Uint8Array.from(
                        Buffer.from(caller, "hex")
                    );
                    let entryPoint = "swap_exact_tokens_for_cspr_js_client";

                    // Set contract installation deploy (unsigned).
                    // let deploy = await makeDeploy(
                    //   publicKey,
                    //   contractHashAsByteArray,
                    //   entryPoint,
                    //   runtimeArgs,
                    //   paymentAmount
                    // );
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
                            const casperService = new CasperServiceByJsonRPC(
                                torus?.provider
                            );
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
            } else {
                console.log("swap_exact_token_for_token");
                const publicKey = CLPublicKey.fromHex(publicKeyHex);
                const caller = ROUTER_CONTRACT_HASH;
                const amount_in = tokenAAmount;
                const amount_out_min = tokenBAmount;
                console.log("publicKeyHex", publicKeyHex);
                let path = swapPath;
                console.log("path", path);
                let _paths = [];
                for (let i = 0; i < path.length; i++) {
                    const p = new CLString("hash-".concat(path[i]));
                    _paths.push(p);
                }
                console.log("_paths", _paths);
                console.log(
                    "amount_out_min * 10 ** 9 - (amount_out_min * 10 ** 9) * slippage / 100",
                    amount_out_min * 10 ** 9 -
                    (amount_out_min * 10 ** 9 * slippage) / 100
                );
                console.log(
                    "amount_out_min - (amount_out_min) * slippage / 100",
                    amount_out_min - (amount_out_min * slippage) / 100
                );
                try {
                    const runtimeArgs = RuntimeArgs.fromMap({
                        amount_in: CLValueBuilder.u256(convertToStr(amount_in)),
                        amount_out_min: CLValueBuilder.u256(
                            convertToStr(amount_out_min - (amount_out_min * slippage) / 100)
                        ),
                        path: new CLList(_paths),
                        to: createRecipientAddress(publicKey),
                        deadline: CLValueBuilder.u256(deadline),
                    });

                    let contractHashAsByteArray = Uint8Array.from(
                        Buffer.from(caller, "hex")
                    );
                    let entryPoint = "swap_exact_tokens_for_tokens_js_client";

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
                            const casperService = new CasperServiceByJsonRPC(
                                torus?.provider
                            );
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
        } else if (inputSelection === "tokenB") {
            if (tokenA.name === "Casper") {
                console.log("swap_cspr_for_exact_token");
                const publicKey = CLPublicKey.fromHex(publicKeyHex);
                const caller = ROUTER_CONTRACT_HASH;
                console.log("publicKeyHex", publicKeyHex);
                let path = swapPath;
                console.log("path", path);
                let _paths = [];
                for (let i = 0; i < path.length; i++) {
                    const p = new CLString("hash-".concat(path[i]));
                    _paths.push(p);
                }
                console.log("_paths", _paths);
                console.log(
                    "mainPurse",
                    Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex"))
                );
                try {
                    const runtimeArgs = RuntimeArgs.fromMap({
                        amount: CLValueBuilder.u512(convertToStr(tokenBAmount)),
                        destination_entrypoint: CLValueBuilder.string("swap_cspr_for_exact_tokens"),
                        router_hash: new CLKey(new CLByteArray(Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex")))),
                        amount_out: CLValueBuilder.u256(convertToStr(tokenBAmount)),
                        amount_in_max: CLValueBuilder.u256(
                            convertToStr(
                                Number(tokenAAmount) + Number((tokenAAmount * slippage) / 100)
                            )
                        ),
                        path: new CLList(_paths),
                        to: createRecipientAddress(publicKey),
                        purse: CLValueBuilder.uref(
                            Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
                            AccessRights.READ_ADD_WRITE
                        ),
                        deadline: CLValueBuilder.u256(deadline),
                    });

                    let contractHashAsByteArray = Uint8Array.from(
                        Buffer.from(caller, "hex")
                    );
                    let entryPoint = "swap_cspr_for_exact_tokens_js_client";

                    // Set contract installation deploy (unsigned).
                    // let deploy = await makeDeploy(
                    //   publicKey,
                    //   contractHashAsByteArray,
                    //   entryPoint,
                    //   runtimeArgs,
                    //   paymentAmount
                    // );
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
                            const casperService = new CasperServiceByJsonRPC(
                                torus?.provider
                            );
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
            } else if (tokenB.name === "Casper") {
                console.log("swap_token_for_exact_cspr");
                const publicKey = CLPublicKey.fromHex(publicKeyHex);
                const caller = ROUTER_CONTRACT_HASH;
                console.log("publicKeyHex", publicKeyHex);
                let path = swapPath;
                console.log("path", path);
                let _paths = [];
                for (let i = 0; i < path.length; i++) {
                    const p = new CLString("hash-".concat(path[i]));
                    _paths.push(p);
                }
                console.log("_paths", _paths);
                try {
                    const runtimeArgs = RuntimeArgs.fromMap({
                        amount: CLValueBuilder.u512(convertToStr(tokenBAmount)),
                        destination_entrypoint: CLValueBuilder.string("swap_tokens_for_exact_cspr"),
                        router_hash: new CLKey(new CLByteArray(Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex")))),
                        amount_out: CLValueBuilder.u256(convertToStr(tokenBAmount)),
                        amount_in_max: CLValueBuilder.u256(
                            convertToStr(
                                Number(tokenAAmount) + Number((tokenAAmount * slippage) / 100)
                            )
                        ),
                        path: new CLList(_paths),
                        to: CLValueBuilder.uref(
                            Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
                            AccessRights.READ_ADD_WRITE
                        ),
                        deadline: CLValueBuilder.u256(deadline),
                    });

                    let contractHashAsByteArray = Uint8Array.from(
                        Buffer.from(caller, "hex")
                    );
                    let entryPoint = "swap_tokens_for_exact_cspr_js_client";

                    // Set contract installation deploy (unsigned).
                    // let deploy = await makeDeploy(
                    //   publicKey,
                    //   contractHashAsByteArray,
                    //   entryPoint,
                    //   runtimeArgs,
                    //   paymentAmount
                    // );
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
                            const casperService = new CasperServiceByJsonRPC(
                                torus?.provider
                            );
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
            } else {
                console.log("swap_token_for_exact_token");
                const publicKey = CLPublicKey.fromHex(publicKeyHex);
                const caller = ROUTER_CONTRACT_HASH;
                console.log("publicKeyHex", publicKeyHex);
                let path = swapPath;
                console.log("path", path);
                let _paths = [];
                for (let i = 0; i < path.length; i++) {
                    const p = new CLString("hash-".concat(path[i]));
                    _paths.push(p);
                }
                console.log("_paths", _paths);
                try {
                    const runtimeArgs = RuntimeArgs.fromMap({
                        amount_out: CLValueBuilder.u256(convertToStr(tokenBAmount)),
                        amount_in_max: CLValueBuilder.u256(
                            convertToStr(
                                Number(tokenAAmount) + Number((tokenAAmount * slippage) / 100)
                            )
                        ),
                        path: new CLList(_paths),
                        to: createRecipientAddress(publicKey),
                        deadline: CLValueBuilder.u256(deadline),
                    });

                    let contractHashAsByteArray = Uint8Array.from(
                        Buffer.from(caller, "hex")
                    );
                    let entryPoint = "swap_tokens_for_exact_tokens_js_client";

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
                            const casperService = new CasperServiceByJsonRPC(
                                torus?.provider
                            );
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
    } else {
        handleCloseSigning();
        let variant = "error";
        enqueueSnackbar("Connect to Wallet Please", { variant });
        setIsLoading(false);
    }
}