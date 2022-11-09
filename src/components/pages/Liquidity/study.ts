import {
  AccessRights,
  CasperClient,
  CLByteArray,
  CLKey,
  CLOption,
  CLPublicKey,
  CLValueBuilder,
  DeployUtil,
  RuntimeArgs,
  Signer,
} from "casper-js-sdk";
import {createRecipientAddress, makeDeploy, normilizeAmountToString} from "../../../commons/swap";
import {
  BASE_URL,
  NODE_ADDRESS,
  ROUTER_CONTRACT_HASH,
} from "../../../constant";
import { Some } from "ts-results";
import axios from "axios";
import {entryPointEnum} from "../../../types";

function convertToStr(a) {
  return a.toString();
}

async function putdeploy(signedDeploy) {
  // Dispatch deploy to node.
  const client = new CasperClient(NODE_ADDRESS);
  let installDeployHash1;
  client
    .putDeploy(signedDeploy)
    .then((installDeployHash) => {
      installDeployHash1 = installDeployHash;
      return getDeploy(installDeployHash, client);
    })
    .then((result) => {
      console.log("result", result);
      console.log(JSON.parse(JSON.stringify(result)));
      return installDeployHash1;
    })
    .catch((e) => console.log(e));
}

function getDeploy(deployHash, client) {
  return client
    .getDeploy(deployHash)
    .then(([deploy, raw]) => {
      if (raw.execution_results.length !== 0) {
        if (raw.execution_results[0].result.Success) {
          return deploy;
        }
      }
      return deploy;
    })
    .catch((e) => e);
}

async function signdeploywithcaspersigner(deploy, publicKeyHex) {
  const deployJSON = DeployUtil.deployToJson(deploy);
  console.log("deployJSON: ", deployJSON);

  const signedDeployJSON = await Signer.sign(
    deployJSON,
    publicKeyHex,
    publicKeyHex
  );
  console.log("signedDeployJSON: ", signedDeployJSON);
  const signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();

  console.log("signed deploy: ", signedDeploy);
  return signedDeploy;
}

async function makeDeployWasm(publicKey, runtimeArgs, paymentAmount, axios) {
  const wasmData = await axios.get(`${BASE_URL}/getWasmData`);
  console.log("wasmData.data.wasmData", wasmData.data.wasmData.data);
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

export function createRuntimeeArgsPool(
  token_AAmount,
  _token_b,
  token_BAmount,
  slippage,
  publicKey,
  mainPurse,
  deadline,
  pair,
  ROUTER_PACKAGE_HASH
) {
  const tokenA = token_AAmount * 10 ** 9;
  const tokenB = token_BAmount * 10 ** 9;
  return RuntimeArgs.fromMap({
    amount: CLValueBuilder.u512(convertToStr(tokenA)),
    destination_entrypoint: CLValueBuilder.string("add_liquidity_cspr"),
    token: new CLKey(_token_b),
    amount_cspr_desired: CLValueBuilder.u256(convertToStr(tokenA)),
    amount_token_desired: CLValueBuilder.u256(convertToStr(tokenB)),
    amount_cspr_min: CLValueBuilder.u256(convertToStr(10)),
    amount_token_min: CLValueBuilder.u256(convertToStr(10)),
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
}

export async function liquidityRuntimeForCSPR(
    token_AAmount,
    _token_b,
    token_BAmount,
    slippage,
    publicKey,
    mainPurse,
    deadline,
    pair,
    paymentAmount,
    ROUTER_PACKAGE_HASH
) {
  const tokenA = token_AAmount * 10 ** 9;

  const runtimeArgs = RuntimeArgs.fromMap({
    amount: CLValueBuilder.u512(normilizeAmountToString(tokenA)),
    destination_entrypoint: CLValueBuilder.string("add_liquidity_cspr"),
    token: new CLKey(_token_b),
    amount_cspr_desired: CLValueBuilder.u256(normilizeAmountToString(Number(token_AAmount - (token_AAmount * slippage) / 100).toFixed(9))),
    amount_token_desired: CLValueBuilder.u256(normilizeAmountToString(Number(token_BAmount - (token_BAmount * slippage) / 100).toFixed(9))),
    amount_cspr_min: CLValueBuilder.u256(normilizeAmountToString(10)),
    amount_token_min: CLValueBuilder.u256(normilizeAmountToString(10)),
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

  return await makeDeployWasm(
      publicKey,
      runtimeArgs,
      paymentAmount,
      axios
  );
}

export async function liquidityRuntimeForERC20(
    tokenAAddress,
    tokenBAddress,
    token_AAmount,
    token_BAmount,
    slippage,
    publicKey,
    deadline,
    pair,
    paymentAmount
) {

  console.log("token a", token_AAmount, "token b", token_BAmount)
  const runtimeArgs = RuntimeArgs.fromMap({
    token_a: new CLKey(tokenAAddress),
    token_b: new CLKey(tokenBAddress),
    amount_a_desired: CLValueBuilder.u256(normilizeAmountToString(Number(token_AAmount - (token_AAmount * slippage) / 100).toFixed(9))),
    amount_b_desired: CLValueBuilder.u256(normilizeAmountToString(Number(token_BAmount - (token_BAmount * slippage) / 100).toFixed(9))),
    amount_a_min: CLValueBuilder.u256(normilizeAmountToString(10)),
    amount_b_min: CLValueBuilder.u256(normilizeAmountToString(10)),
    to: createRecipientAddress(publicKey),
    deadline: CLValueBuilder.u256(deadline),
    pair: new CLOption(Some(new CLKey(pair))),
  });

  const caller = ROUTER_CONTRACT_HASH;
  const entryPoint = entryPointEnum.Add_liquidity

  // Set contract installation deploy (unsigned).
  return await makeDeploy(
      publicKey,
      Uint8Array.from(Buffer.from(caller, "hex")),
      entryPoint,
      runtimeArgs,
      paymentAmount
  );
}