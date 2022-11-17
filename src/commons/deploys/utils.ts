import {
  CLAccountHash,
  CLKey,
  CLKeyParameters,
  CLPublicKey,
} from 'casper-js-sdk';

/**
 * Convert a publickey into a CLKey
 * 
 * @param recipient public key of recipient
 * @returns a CLKey encoding the public key
 */
 export function createRecipientAddress(recipient: CLKeyParameters | CLPublicKey): CLKey {
  if (recipient instanceof CLPublicKey) {
    return new CLKey(new CLAccountHash(recipient.toAccountHash()))
  } else {
    return new CLKey(recipient);
  }
}