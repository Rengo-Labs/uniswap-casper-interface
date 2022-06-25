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
import { NODE_ADDRESS, ROUTER_CONTRACT_HASH } from "../../../constant";
import { Some } from "ts-results";

function convertToStr(a) {
  return a.toString();
}

async function putdeploy(signedDeploy) {
  // Dispatch deploy to node.
  const client = new CasperClient(NODE_ADDRESS);
  const installDeployHash = await client.putDeploy(signedDeploy);
  console.log(`... Contract installation deployHash: ${installDeployHash}`);
  const result = await getDeploy(NODE_ADDRESS, installDeployHash);
  console.log(
    `... Contract installed successfully.`,
    JSON.parse(JSON.stringify(result))
  );
  return installDeployHash;
}

async function getDeploy(NODE_URL, deployHash) {
  const client = new CasperClient(NODE_URL);
  let i = 1000;
  while (i !== 0) {
    const [deploy, raw] = await client.getDeploy(deployHash);
    if (raw.execution_results.length !== 0) {
      // @ts-ignore
      if (raw.execution_results[0].result.Success) {
        return deploy;
      }
    }
  }
  throw Error("Timeout after " + i + "s. Something's wrong");
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
  let wasmData = await axios.get("/getWasmData");
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

function createRuntimeeArgsPool(
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
  return RuntimeArgs.fromMap({
    amount: CLValueBuilder.u512(convertToStr(token_AAmount)),
    destination_entrypoint: CLValueBuilder.string("add_liquidity_cspr"),
    token: new CLKey(_token_b),
    amount_cspr_desired: CLValueBuilder.u256(convertToStr(token_AAmount)),
    amount_token_desired: CLValueBuilder.u256(convertToStr(token_BAmount)),
    amount_cspr_min: CLValueBuilder.u256(
      convertToStr(
        Number(token_AAmount - (token_AAmount * slippage) / 100).toFixed(9)
      )
    ),
    amount_token_min: CLValueBuilder.u256(
      convertToStr(
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
}
async function addLiquidityMakeDeploy(
  axios,
  activePublicKey,
  tokenA,
  tokenB,
  tokenAAmount,
  tokenBAmount,
  slippage,
  mainPurse,
  ROUTER_PACKAGE_HASH
) {
  const publicKeyHex = activePublicKey;
  const selectedWallet = "Casper";
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
  // Set contract installation deploy (unsigned).
  let deploy = await makeDeployWasm(
    publicKey,
    runtimeArgs,
    paymentAmount,
    axios
  );
  if (selectedWallet === "Casper") {
    let signedDeploy = await signdeploywithcaspersigner(deploy, publicKeyHex);
    let result = await putdeploy(signedDeploy);
  }
}
