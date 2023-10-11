export const ERROR_BLOCKCHAIN = {
  "Mint error: 0": {
    message: "Error: Insufficent CSPR for gas."
  },
  "Error: Contract execution: User error: 38": {
    message: "Error: The amount need to be greater than zero."
  },
  "Error: Contract execution: User error: 55": {
    message: "Error: Tried to reserve reserve that does not exist." //Todo check this
  },
  "Error: Contract execution: User error: 67": {
    message: "Error: First token amount is below minimum."
  },
  "Error: Contract execution: User error: 68": {
    message: "Error: Second token amount is below minimum."
  },
  "Error: Contract execution: User error: 69": {
    message: "Error: Trying to add liquidity below minimum."
  },
  "Error: Contract execution: User error: 70": {
    message: "Error: Trying to remove liquidity below minimum."
  },
  "Error: Contract execution: User error: 71": {
    message: "Error: Received token amount exceeds slippage."
  },
  "Error: Contract execution: User error: 73": {
    message: "Error: This function requires first token to be WCSPR."
  },
  "Error: Contract execution: User error: 74": {
    message: "Error: Slippage exceeded, increase slippage and try again."
  },
  "Error: Contract execution: User error: 76": {
    message: "Error: Slippage exceeded, increase slippage and try again."
  },
  "Error: Contract execution: User error: 77": {
    message: "Error: This function requires second token to be WCSPR."
  },
  "Error: Contract execution: User error: 78": {
    message: "Error: Slippage exceeded, increase slippage and try again."
  },
  "Error: Contract execution: User error: 82": {
    message: "Error: Slippage exceeded, increase slippage and try again."
  },
  "Error: Contract execution: User error: 83": {
    message: "Error: Deploy timed out."
  },
  "Error: Contract execution: User error: 84": {
    message: "Error: Deploy timed out."
  },
  "Error: Contract execution: User error: 85": {
    message: "Error: Deploy timed out."
  },
  "Error: Contract execution: User error: 89": {
    message: "Error: Deploy timed out."
  },
  "Error: Contract execution: User error: 90": {
    message: "Error: Deploy timed out."
  },
  "Error: Contract execution: User error: 91": {
    message: "Error: Deploy timed out."
  },
  "Error: Contract execution: User error: 92": {
    message: "Error: Deploy timed out."
  },
  "Error: Contract execution: User error: 95": {
    message: "Error: Addition overflow detected."
  },
  "Error: Contract execution: User error: 96": {
    message: "Error: Zero address detected."
  },
  "Error: Contract execution: User error: 129": {
    message: "Error: address is not added in the whitelist"
  },
  "Error: Contract execution: User error: 65533": {
    message: "Error: The approval amount is less than the current allowance."
  },
  "Error: Out of gas error": {
    message: "Error: Insufficient gas. The gas needs to be increased and greater than 0."
  },
  "invalid BigNumber string (argument=\"value\", value=\"NaN\", code=INVALID_ARGUMENT, version=bignumber/5.1.1)": {
    message: "Error: Deploy argument is missing."
  },
  "Error: Contract execution: ApiError::MissingArgument [2]": {
    message: "Error: Deploy argument is missing."
  },
  "Error: Contract execution: ApiError::InvalidArgument [3]": {
    message: "Error: Deploy argument is invalid."
  },
  "Error: Contract execution: Out of gas error": {
    message: "Error: Insufficient gas."
  },
  "TypeError: Cannot read properties of undefined (reading 'deploy')": {
    message: "Error: The wallet is disconnected."
  },
  "TypeError: The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type undefined": {
    message: "Error: Signature canceled by user."
  }
}
