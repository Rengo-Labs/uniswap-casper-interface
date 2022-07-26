import {
  AccessRights,
  CasperClient,
  CasperServiceByJsonRPC,
  CLAccountHash,
  CLByteArray,
  CLKey,
  CLList,
  CLOption,
  CLPublicKey,
  CLString,
  CLValueBuilder,
  DeployUtil,
  RuntimeArgs,
  Signer,
} from "casper-js-sdk";
import {
  BASE_URL,
  CHAINS,
  NODE_ADDRESS,
  ROUTER_CONTRACT_HASH,
  ROUTER_PACKAGE_HASH,
  SUPPORTED_NETWORKS,
  URL_DEPLOY,
} from "../../constant";
import toast from "react-hot-toast";
import axios from "axios";
import Torus from "@toruslabs/casper-embed";
import { Some } from "ts-results";

const convertToStr = (e) => e.toString();
export function createRecipientAddress(recipient) {
  if (recipient instanceof CLPublicKey) {
    return new CLKey(new CLAccountHash(recipient.toAccountHash()));
  } else {
    return new CLKey(recipient);
  }
}
export const getStateRootHash = async (nodeAddress, activePublicKey) => {
  const client = new CasperServiceByJsonRPC(nodeAddress);
  const { block } = await client.getLatestBlockInfo();
  if (block) {
    return block.header.state_root_hash;
  } else {
    throw Error("Problem when calling getLatestBlockInfo");
  }
};
// getStateRootHash(NODE_ADDRESS,activePublicKey).then(stateRootHash => {
//     const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
//     client.getBlockState(
//       stateRootHash,
//       CLPublicKey.fromHex(activePublicKey).toAccountHashStr(),
//       []
//     ).then(result => {
//       //setMainPurse(result.Account.mainPurse)
//     });
//   })
export async function makeDeployWasm(publicKey, runtimeArgs, paymentAmount) {
  let wasmData = await axios.get(`${BASE_URL}/getWasmData`);
  let deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(publicKey, "casper-test"),
    DeployUtil.ExecutableDeployItem.newModuleBytes(
      new Uint8Array(wasmData.data.wasmData.data),
      runtimeArgs
    ),
    DeployUtil.standardPayment(paymentAmount)
  );
  return deploy;
}

export function createRuntimeArgs(
  amount_in,
  slippSwapToken,
  _paths,
  publicKey,
  mainPurse,
  deadline
) {
  try {
    const amount = convertToStr(parseFloat(amount_in) * 10 ** 9);
    return RuntimeArgs.fromMap({
      amount: CLValueBuilder.u512(amount),
      destination_entrypoint: CLValueBuilder.string(
        "swap_exact_cspr_for_tokens"
      ),
      router_hash: new CLKey(
        new CLByteArray(
          Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex"))
        )
      ),
      amount_in: CLValueBuilder.u256(amount),
      amount_out_min: CLValueBuilder.u256(
        //convertToStr(parseFloat(slippSwapToken) * 10 ** 9)
        convertToStr(10)
      ),
      path: new CLList(_paths),
      to: createRecipientAddress(publicKey),
      purse: CLValueBuilder.uref(
        Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
        AccessRights.READ_ADD_WRITE
      ),
      deadline: CLValueBuilder.u256(deadline),
    });
  } catch (error) {
    console.log(error);
  }
}
export async function getswapPath(tokenASymbol, tokenBSymbol) {
  const complete = `${BASE_URL}/getpath`;
  const request = await axios.post(complete, {
    tokenASymbol: "WCSPR",
    tokenBSymbol: "WETH",
  });
  return request.data.pathwithcontractHash.map((x) => {
    return new CLString("hash-".concat(x));
  });
}

export async function makeDeployLiquidity(
  publicKey,
  contractHashAsByteArray,
  entryPoint,
  runtimeArgs,
  paymentAmount
) {
  let deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(publicKey, "casper-test"),
    DeployUtil.ExecutableDeployItem.newStoredContractByHash(
      contractHashAsByteArray,
      entryPoint,
      runtimeArgs
    ),
    DeployUtil.standardPayment(paymentAmount)
  );
  return deploy;
}

export async function makeDeployLiquidityWasm(
  publicKey,
  runtimeArgs,
  paymentAmount
) {
  let wasmData = await axios.get(`${BASE_URL}/getWasmData`);
  console.log("wasmData.data.wasmData", wasmData.data.wasmData.data);
  console.log(
    "new Uint8Array(wasmData.data.wasmData.data)",
    new Uint8Array(wasmData.data.wasmData.data)
  );
  let deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(publicKey, "casper-test"),
    DeployUtil.ExecutableDeployItem.newModuleBytes(
      new Uint8Array(wasmData.data.wasmData.data),
      runtimeArgs
    ),
    DeployUtil.standardPayment(paymentAmount)
  );
  return deploy;
}

async function addLiquidityMakeDeployLiquidityV2(
  activePublicKey,
  tokenA,
  tokenB,
  tokenAAmount,
  tokenBAmount,
  mainPurse,
  slippage
) {
  const publicKeyHex = activePublicKey;

  const publicKey = CLPublicKey.fromHex(publicKeyHex);
  const caller = ROUTER_CONTRACT_HASH;
  const tokenAAddress = tokenA?.packageHash;
  const tokenBAddress = tokenB?.packageHash;
  const token_AAmount = tokenAAmount;
  const token_BAmount = tokenBAmount;
  const deadline = 1739598100811;
  const paymentAmount = 10000000000;
  const _token_b = new CLByteArray(
    Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
  );
  const pair = new CLByteArray(
    Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
  );
  const runtimeArgs = RuntimeArgs.fromMap({
    amount: CLValueBuilder.u512(convertToString(token_AAmount)),
    destination_entrypoint: CLValueBuilder.string("add_liquidity_cspr"),
    token: new CLKey(_token_b),
    amount_cspr_desired: CLValueBuilder.u256(convertToString(token_AAmount)),
    amount_token_desired: CLValueBuilder.u256(convertToString(token_BAmount)),
    amount_cspr_min: CLValueBuilder.u256(
      convertToString(
        Number(token_AAmount - (token_AAmount * slippage) / 100).toFixed(9)
      )
    ),
    amount_token_min: CLValueBuilder.u256(
      convertToString(
        Number(token_BAmount - (token_BAmount * slippage) / 100).toFixed(9)
      )
    ),
    to: createRecipientAddress(publicKey),
    purse: CLValueBuilder.uref(
      Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
      AccessRights.READ_ADD_WRITE
    ),
    deadline: CLValueBuilder.u256(deadline),
    pair: new CLOption(Some(new CLKey(pair))),
    router_hash: new CLKey(
      new CLByteArray(Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex")))
    ),
  });
  // Set contract installation deploy (unsigned).
  let deploy = await makeDeployWasm(publicKey, runtimeArgs, paymentAmount);
  return deploy;
}

export function convertToString(e) {
  return e.toString();
}

export async function removeLiquidityPutDeploy(signedDeploy, activePublicKey) {
  // Dispatch deploy to node.
  const client = new CasperClient(NODE_ADDRESS);
  const installDeployHash = await client.putDeploy(signedDeploy);
  let param = {
    user: Buffer.from(
      CLPublicKey.fromHex(activePublicKey).toAccountHash()
    ).toString("hex"),
    deployHash: installDeployHash,
  };
  console.log(`... Contract installation deployHash: ${installDeployHash}`);
  await axios
    .post(`${BASE_URL}/setUserForRemoveLiquidityCSPR`, param)
    .then(async (res) => {
      console.log("setUserForRemoveLiquidityCSPR", res);
      const result = await getDeploy(installDeployHash);
      console.log(
        `... Contract installed successfully.`,
        JSON.parse(JSON.stringify(result))
      );
    })
    .catch((error) => {
      console.log(error);
      console.log(error.response);
    });

  return installDeployHash;
}

export function CLBArray(token) {
  return new CLByteArray(Uint8Array.from(Buffer.from(token.slice(5), "hex")));
}

export function removeLiquidityArgs(
  tokenAAddress,
  tokenBAddress,
  liquidity,
  value,
  slippage,
  token_AAmount_,
  token_BAmount_,
  publicKeyWallet
) {
  const _token_a = CLBArray(tokenAAddress);
  const _token_b = CLBArray(tokenBAddress);
  const publicKey = CLPublicKey.fromHex(publicKeyWallet);
  const deadline = 1739598100811;
  const token_AAmount = (1 / 100).toFixed(9); //tokenAAmountPercent.toFixed(9);
  const token_BAmount = (1 / 100).toFixed(9); //tokenBAmountPercent.toFixed(9);
  try {
    return RuntimeArgs.fromMap({
      token_a: new CLKey(_token_a),
      token_b: new CLKey(_token_b),
      liquidity: CLValueBuilder.u256(convertToStr((liquidity * value) / 100)),
      amount_a_min: CLValueBuilder.u256(
        convertToStr(
          Number(token_AAmount - (token_AAmount * slippage) / 100).toFixed(9)
        )
      ),
      amount_b_min: CLValueBuilder.u256(
        convertToStr(
          Number(token_BAmount - (token_BAmount * slippage) / 100).toFixed(9)
        )
      ),
      to: createRecipientAddress(publicKey),
      deadline: CLValueBuilder.u256(deadline),
    });
  } catch (error) {
    console.log(error.message);
  }
}
export async function makeDeploy(
  publicKey,
  contractHashAsByteArray,
  entryPoint,
  runtimeArgs,
  paymentAmount
) {
  let deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(publicKey, "casper-test"),
    DeployUtil.ExecutableDeployItem.newStoredContractByHash(
      contractHashAsByteArray,
      entryPoint,
      runtimeArgs
    ),
    DeployUtil.standardPayment(paymentAmount)
  );
  return deploy;
}

export async function signDeployWithTorus(deploy) {
  try {
    const torus = new Torus();
    await torus.init({
      buildEnv: "testing",
      showTorusButton: true,
      network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
    });
    const casperService = new CasperServiceByJsonRPC(torus?.provider);
    return await casperService.deploy(deploy);
  } catch (error) {
    console.log("signDeployWithTorus");
    console.log(error);
    return false;
  }
}

export async function signdeploywithcaspersigner(deploy, publicKeyHex) {
  try {
    let deployJSON = DeployUtil.deployToJson(deploy);
    let signedDeployJSON = await Signer.sign(
      deployJSON,
      publicKeyHex,
      publicKeyHex
    );
    console.log("signedDeployJSON: ", signedDeployJSON);
    let signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();

    console.log("signed deploy: ", signedDeploy);
    return signedDeploy;
  } catch (error) {
    console.log("signdeploywithcaspersigner", error);
    throw Error(error);
  }
}
export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function putdeploySigner(signedDeploy) {
  // Dispatch deploy to node.
  try {
    const client = new CasperClient(NODE_ADDRESS);
    const installDeployHash = await client.putDeploy(signedDeploy);
    console.log(`... Contract installation deployHash: ${installDeployHash}`);
    const result = await getDeploySigner(installDeployHash);
    console.log(
      `... Contract installed successfully.`,
      JSON.parse(JSON.stringify(result))
    );
    return installDeployHash;
  } catch (error) {
    console.log("putdeploySigner", error);
    throw Error(error.message);
  }
}

export async function getDeploySigner(deployHash) {
  try {
    const client = new CasperClient(NODE_ADDRESS);
    let i = 1000;
    while (i !== 0) {
      const [deploy, raw] = await client.getDeploy(deployHash);
      if (raw.execution_results.length !== 0) {
        // @ts-ignore
        if (raw.execution_results[0].result.Success) {
          return deploy;
        } else {
          // @ts-ignore
          let variant = "error";
          throw Error(
            "Contract execution: " +
              raw.execution_results[0].result.Failure.error_message
          );
        }
      } else {
        i--;
        await sleep(1000);
        continue;
      }
    }
    throw Error("Timeout after " + i + "s. Something's wrong");
  } catch (error) {
    console.log("getDeploySigner", error);
    throw Error(error);
  }
}
export async function getDeploy(deployHash) {
  const client = new CasperClient(NODE_ADDRESS);
  let i = 1000;
  while (i !== 0) {
    console.log("try ", i);
    const [deploy, raw] = await client.getDeploy(deployHash);
    if (raw.execution_results.length !== 0) {
      // @ts-ignore
      if (raw.execution_results[0].result.Success) {
        return deploy;
      } else {
        // @ts-ignore
        let variant = "error";
        throw Error(
          "Contract execution: " +
            raw.execution_results[0].result.Failure.error_message
        );
      }
    } else {
      i--;
      await sleep(1000);
      continue;
    }
  }
  throw Error("Timeout after " + i + "s. Something's wrong");
}
export async function putdeploy(signedDeploy) {
  // Dispatch deploy to node.
  const client = new CasperClient(NODE_ADDRESS);
  const installDeployHash = await client.putDeploy(signedDeploy);
  console.log(`... Contract installation deployHash: ${installDeployHash}`);
  const result = await getDeploy(installDeployHash);
  console.log(
    `... Contract installed successfully.`,
    JSON.parse(JSON.stringify(result))
  );
  return installDeployHash;
}
export async function swapMakeDeploy(
  publicKeyHex,
  deadline,
  paymentAmount,
  amount_in,
  amount_out_min,
  tokenASymbol,
  tokenBSymbol,
  slippSwapToken,
  mainPurse,
  toastLoading,
  countSetter
) {
  const publicKey = CLPublicKey.fromHex(publicKeyHex);
  let _paths = await getswapPath(tokenASymbol, tokenBSymbol);
  const runtimeArgs = createRuntimeArgs(
    amount_in,
    slippSwapToken,
    _paths,
    publicKey,
    mainPurse,
    deadline
  );

  let deploy = await makeDeployWasm(publicKey, runtimeArgs, paymentAmount);

  let signedDeploy = await signdeploywithcaspersigner(deploy, publicKeyHex);
  toast.dismiss(toastLoading);
  const toastLoadingg = toast.loading("Waiting for deployment...");

  putdeploy(signedDeploy)
    .then((x) => {
      toast.dismiss(toastLoadingg);
      toast.success("Transaction has been successfully deployed");
      countSetter((count) => count + 1);
    })
    .catch((err) => {
      toast.dismiss(toastLoadingg);
      toast.error("Oops we have an error! try again");
    });
}

export function updateBalances(
  walletAddress,
  tokens,
  tokenDispatch,
  secondTokenSelected
) {
  Object.keys(tokens).map((x) => {
    if (tokens[`${x}`].contractHash.length > 0) {
      const param = {
        contractHash: tokens[`${x}`].contractHash.slice(5),
        user: Buffer.from(
          CLPublicKey.fromHex(walletAddress).toAccountHash()
        ).toString("hex"),
      };
      axios
        .post(`${BASE_URL}/balanceagainstuser`, param)
        .then((res) => {
          const balance = parseInt(res.data.balance) / 10 ** 9;
          tokenDispatch({
            type: "LOAD_BALANCE_TOKEN",
            payload: { name: x, data: balance },
          });
          if (x === secondTokenSelected.symbol) {
            tokenDispatch({ type: "BALANCE_SECOND_TOKEN", payload: balance });
          }
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
        });
    }
  });
}

export async function getStatus(casperService, walletAddress, setMainPurse) {
  const stateRootHash = await casperService.getStateRootHash();
  const result = await casperService.getBlockState(
    stateRootHash,
    CLPublicKey.fromHex(walletAddress).toAccountHashStr(),
    []
  );
  setMainPurse(result.Account.mainPurse);
  const balance = await casperService.getAccountBalance(
    stateRootHash,
    result.Account.mainPurse
  );
  const real = balance / 10 ** 9;
  return real.toString();
}
