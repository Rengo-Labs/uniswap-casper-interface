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
import { createRecipientAddress } from "../../../commons/swap";
import {
  BASE_URL,
  NODE_ADDRESS,
  ROUTER_CONTRACT_HASH,
} from "../../../constant";
import { Some } from "ts-results";
import toast from "react-hot-toast";

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
  let deployJSON = DeployUtil.deployToJson(deploy);
  console.log("deployJSON: ", deployJSON);

  let signedDeployJSON = await Signer.sign(
    deployJSON,
    publicKeyHex,
    publicKeyHex
  );
  console.log("signedDeployJSON: ", signedDeployJSON);
  let signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();

  console.log("signed deploy: ", signedDeploy);
  return signedDeploy;
}

async function makeDeployWasm(publicKey, runtimeArgs, paymentAmount, axios) {
  let wasmData = await axios.get(`${BASE_URL}/getWasmData`);
  console.log("wasmData.data.wasmData", wasmData.data.wasmData.data);
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
export async function addLiquidityMakeDeploy(
  axios,
  activePublicKey,
  tokenA,
  tokenB,
  tokenAAmount,
  tokenBAmount,
  slippage,
  mainPurse,
  ROUTER_PACKAGE_HASH,
  countSetter,
  toastLoading,
  casperService
) {
  const publicKeyHex = activePublicKey;
  const selectedWallet = "Casper";
  const publicKey = CLPublicKey.fromHex(publicKeyHex);
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
  const runtimeArgs = createRuntimeeArgsPool(
    token_AAmount,
    _token_b,
    token_BAmount,
    slippage,
    publicKey,
    mainPurse,
    deadline,
    pair,
    ROUTER_PACKAGE_HASH
  );
  let deploy = makeDeployWasm(publicKey, runtimeArgs, paymentAmount, axios);
  return deploy;
}
