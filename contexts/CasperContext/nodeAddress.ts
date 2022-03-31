import { CasperClient } from "casper-js-sdk";



export const NODE_ADDRESS = 'https://casperlabs-proxy-server.herokuapp.com/http://159.65.118.250:7777/rpc'


export async function putdeploy(signedDeploy) {
    // Dispatch deploy to node.
    const client = new CasperClient(NODE_ADDRESS);
}