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
} from "../../constant";
import toast from "react-hot-toast";
import axios from "axios";
import Torus from "@toruslabs/casper-embed";
import { Some } from "ts-results";
import { entryPointEnum } from "../../types";
import { tokenReducerEnum } from "../../reducers/TokenReducers";
import Decimal from 'decimal.js'

export const normilizeAmountToString = (amount) => {
  const strAmount = amount.toString().includes('e') ? amount.toFixed(9).toString() : amount.toString();
  const amountArr = strAmount.split('.')
  if (amountArr[1] === undefined) {
    const concatedAmount = amountArr[0].concat('000000000')
    return concatedAmount
  } else {
    let concatedAmount = amountArr[0].concat(amountArr[1].slice(0, 9))
    for (let i = 0; i < 9 - amountArr[1].length; i++) {
      concatedAmount = concatedAmount.concat('0')
    }
    return concatedAmount
  }
}

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
  const wasmData = await axios.get(`${BASE_URL}/getWasmData`);
  const deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(publicKey, "casper-test"),
    DeployUtil.ExecutableDeployItem.newModuleBytes(
      new Uint8Array(wasmData.data.wasmData.data),
      runtimeArgs
    ),
    DeployUtil.standardPayment(paymentAmount)
  );
  return deploy;
}
function ConvertString(amount) {
  return amount.toString();
}
export function createRuntimeArgs(
  amount_in,
  amount_out,
  slippSwapToken,
  _paths,
  publicKey,
  mainPurse,
  deadline,
  entryPoint
) {
  try {
    const amount = normilizeAmountToString(amount_in);
    const amount_out_min = amount_out - (amount_out * slippSwapToken) / 100
    console.log("amount_out",amount_out)
    console.log("slippSwapToken",slippSwapToken)
    console.log("amount_out_min",amount_out_min)
    return RuntimeArgs.fromMap({
      amount: CLValueBuilder.u512(amount),
      destination_entrypoint: CLValueBuilder.string(entryPoint),
      router_hash: new CLKey(
        new CLByteArray(
          Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex"))
        )
      ),
      amount_in: CLValueBuilder.u256(amount),
      amount_out_min: CLValueBuilder.u256(
        normilizeAmountToString(amount_out_min)
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

export const selectEntryPoint = (tokenA, tokenB) => {
  if (tokenA === 'WCSPR' && tokenB !== 'WCSPR') {
    return entryPointEnum.Swap_exact_cspr_for_tokens
  } else if (tokenA !== 'WCSPR' && tokenB === 'WCSPR') {
    return entryPointEnum.Swap_tokens_for_exact_cspr_js_client
  } else if (tokenA !== 'WCSPR' && tokenB !== 'CSPR') {
    return entryPointEnum.Swap_exact_tokens_for_tokens_js_client
  }
}

export function createSwapToReceiveCSPRRuntimeArgs(
  amount_in,
  amount_out,
  slippSwapToken,
  _paths,
  publicKey,
  mainPurse,
  deadline,
  entryPoint
) {
  try {
    const amount = normilizeAmountToString(amount_in);
    const amount_out_min = amount_out - (amount_out * slippSwapToken) / 100
    return RuntimeArgs.fromMap({
      amount: CLValueBuilder.u512(amount),
      destination_entrypoint: CLValueBuilder.string(entryPoint),
      router_hash: new CLKey(
        new CLByteArray(
          Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex"))
        )
      ),
      amount_in_max: CLValueBuilder.u256(amount),
      amount_out: CLValueBuilder.u256(
        normilizeAmountToString(amount_out_min)
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

export async function createSwapRuntimeArgs(
  amount_in,
  amount_out_min,
  slippSwapToken,
  _paths,
  publicKey,
  mainPurse,
  deadline,
  entryPointSelected
) {
  const amount_out = amount_out_min - (amount_out_min * slippSwapToken) / 100
  const runtimeArgs = RuntimeArgs.fromMap({
    amount_in: CLValueBuilder.u256(normilizeAmountToString(amount_in)),
    amount_out_min: CLValueBuilder.u256(
      normilizeAmountToString(amount_out)
    ),
    path: new CLList(_paths),
    to: createRecipientAddress(publicKey),
    deadline: CLValueBuilder.u256(deadline),
  });
  const contractHashAsByteArray = Uint8Array.from(
    Buffer.from(ROUTER_CONTRACT_HASH, "hex")
  );
  
  const entryPoint = entryPointEnum.Swap_exact_tokens_for_tokens_js_client;
  // Set contract installation deploy (unsigned).
  return await makeDeploySwap(
    publicKey,
    contractHashAsByteArray,
    entryPoint,
    runtimeArgs,
    10_000_000_000
  );
}

export async function createSwapRuntimeArgs2(
  amount_in,
  amount_out_min,
  slippSwapToken,
  _paths,
  publicKey,
  mainPurse,
  deadline,
  entryPointSelected
) {
  const amount_out = amount_out_min - (amount_out_min * slippSwapToken) / 100
  const runtimeArgs = RuntimeArgs.fromMap({
    amount_in_max: CLValueBuilder.u256(normilizeAmountToString(amount_in)),
    amount_out: CLValueBuilder.u256(
      normilizeAmountToString(amount_out)
    ),
    path: new CLList(_paths),
    to: CLValueBuilder.uref(
      Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
      AccessRights.READ_ADD_WRITE
    ),
    deadline: CLValueBuilder.u256(deadline),
  });
  const contractHashAsByteArray = Uint8Array.from(
    Buffer.from(ROUTER_CONTRACT_HASH, "hex")
  );
  const entryPoint = entryPointSelected;
  // Set contract installation deploy (unsigned).
  return await makeDeploySwap(
    publicKey,
    contractHashAsByteArray,
    entryPoint,
    runtimeArgs,
    10_000_000_000
  );
}

export async function makeDeploySwap(
  publicKey,
  contractHashAsByteArray,
  entryPoint,
  runtimeArgs,
  paymentAmount
) {
  const deploy = DeployUtil.makeDeploy(
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

export async function getswapPath(tokenASymbol, tokenBSymbol) {
  const complete = `${BASE_URL}/getpath`;
  const request = await axios.post(complete, {
    tokenASymbol: tokenASymbol,
    tokenBSymbol: tokenBSymbol,
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
  const deploy = DeployUtil.makeDeploy(
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
  const wasmData = await axios.get(`${BASE_URL}/getWasmData`);
  console.log("wasmData.data.wasmData", wasmData.data.wasmData.data);
  console.log(
    "new Uint8Array(wasmData.data.wasmData.data)",
    new Uint8Array(wasmData.data.wasmData.data)
  );
  const deploy = DeployUtil.makeDeploy(
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
  const deploy = await makeDeployWasm(publicKey, runtimeArgs, paymentAmount);
  return deploy;
}

export function convertToString(e) {
  return e.toString();
}

export async function removeLiquidityPutDeploy(signedDeploy, activePublicKey) {
  // Dispatch deploy to node.
  const client = new CasperClient(NODE_ADDRESS);
  const installDeployHash = await client.putDeploy(signedDeploy);
  const param = {
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
  return new CLByteArray(Uint8Array.from(Buffer.from(token, "hex")));
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
      token_a: CLValueBuilder.key(_token_a),
      token_b: CLValueBuilder.key(_token_b),
      liquidity: CLValueBuilder.u256(normilizeAmountToString(liquidity)),
      amount_a_min: CLValueBuilder.u256(normilizeAmountToString(token_AAmount_)),
      amount_b_min: CLValueBuilder.u256(normilizeAmountToString(token_BAmount_)),
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
  const deploy = DeployUtil.makeDeploy(
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
    const deployJSON = DeployUtil.deployToJson(deploy);
    const signedDeployJSON = await Signer.sign(
      deployJSON,
      publicKeyHex,
      publicKeyHex
    );
    console.log("signedDeployJSON: ", signedDeployJSON);
    const signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();

    console.log("signed deploy: ", signedDeploy);
    (signedDeploy as any).deploy_hash = (signedDeployJSON.deploy as any).hash
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

export async function withPutDeploy(signedDeploy, setDeployExplorer) {
  try {
    const client = new CasperClient(NODE_ADDRESS);
    const installDeployHash = await client.putDeploy(signedDeploy);
    const deployHash = `https://testnet.cspr.live/deploy/${installDeployHash}`;
    setDeployExplorer(deployHash);
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
          const variant = "error";
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
        const variant = "error";
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
  const _paths = await getswapPath(tokenASymbol, tokenBSymbol);
  console.log("tokenASymbol", tokenASymbol);
  console.log("tokenBSymbol", tokenBSymbol);
  const entryPoint = selectEntryPoint(tokenASymbol, tokenBSymbol)
  const runtimeArgs = createRuntimeArgs(
    amount_in,
    amount_out_min,
    slippSwapToken,
    _paths,
    publicKey,
    mainPurse,
    deadline,
    entryPoint
  );
  const deploy = await makeDeployWasm(publicKey, runtimeArgs, paymentAmount);

  const signedDeploy = await signdeploywithcaspersigner(deploy, publicKeyHex);
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
  secondTokenSelected,
  firstTokenSelected,
  casperBalance
) {
  console.log("Load balance")
  if ("CSPR" === secondTokenSelected.symbol) {
    tokenDispatch({ type: "BALANCE_SECOND_TOKEN", payload: casperBalance });
  }
  if ("CSPR" === firstTokenSelected.symbol) {
    tokenDispatch({ type: tokenReducerEnum.LOAD_BALANCE, payload: { name: "CSPR", data: casperBalance } })
  } else {
    tokenDispatch({ type: "LOAD_BALANCE_TOKEN", payload: { name: "CSPR", data: casperBalance } });
  }
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

          if (x === firstTokenSelected.symbol) {
            tokenDispatch({ type: tokenReducerEnum.LOAD_BALANCE, payload: { name: x, data: balance } })
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
