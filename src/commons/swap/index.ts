import {
  AccessRights,
  CasperClient,
  CasperServiceByJsonRPC,
  CLAccountHash,
  CLByteArray,
  CLKey,
  CLList,
  CLPublicKey,
  CLString,
  CLValueBuilder,
  DeployUtil,
  RuntimeArgs,
  Signer,
} from "casper-js-sdk";
import { BASE_URL, NODE_ADDRESS, ROUTER_PACKAGE_HASH } from "../../constant";

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
export async function makeDeployWasm(
  publicKey,
  runtimeArgs,
  paymentAmount,
  fetch
) {
  let wasmData = await fetch.get("/getWasmData");
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

export function createRuntimeArgs(
  amount_in,
  ROUTER_PACKAGE_HASH,
  amount_out_min,
  slippage,
  _paths,
  publicKey,
  mainPurse,
  deadline
) {
  try {
    return RuntimeArgs.fromMap({
      amount: CLValueBuilder.u512(amount_in.toString()),
      destination_entrypoint: CLValueBuilder.string(
        "swap_exact_cspr_for_tokens"
      ),
      router_hash: new CLKey(
        new CLByteArray(
          Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex"))
        )
      ),
      amount_in: CLValueBuilder.u256(amount_in.toString()),
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
    });
  } catch (error) {
    console.log(error);
  }
}
async function getswapPath(tokenASymbol, tokenBSymbol, axios) {
  const complete = `${BASE_URL}/getpath`;
  const request = await axios.post(complete, {
    tokenASymbol: "WCSPR",
    tokenBSymbol: "WETH",
  });
  return request.data.pathwithcontractHash.map((x) => {
    return new CLString("hash-".concat(x));
  });
}
export async function signdeploywithcaspersigner(deploy, publicKeyHex) {
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
export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function getDeploy(NODE_URL, deployHash) {
  const client = new CasperClient(NODE_URL);
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
}
export async function putdeploy(signedDeploy) {
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
export async function swapMakeDeploy(
  publicKeyHex,
  deadline,
  paymentAmount,
  amount_in,
  amount_out_min,
  tokenASymbol,
  tokenBSymbol,
  slippage,
  mainPurse,
  axios
) {
  const publicKey = CLPublicKey.fromHex(publicKeyHex);
  let _paths = await getswapPath(tokenASymbol, tokenBSymbol, axios);
  const runtimeArgs = createRuntimeArgs(
    amount_in,
    ROUTER_PACKAGE_HASH,
    amount_out_min,
    slippage,
    _paths,
    publicKey,
    mainPurse,
    deadline
  );

  let deploy = await makeDeployWasm(
    publicKey,
    runtimeArgs,
    paymentAmount,
    fetch
  );

  let signedDeploy = await signdeploywithcaspersigner(deploy, publicKeyHex);
  let result = await putdeploy(signedDeploy);
}
