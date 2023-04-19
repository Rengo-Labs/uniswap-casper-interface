import {
  CLAccountHash,
  CLKey,
  CLPublicKey,
  CLByteArray,
  PUBLIC_KEY_TYPE,
} from 'casper-js-sdk';

export type RecipientType = CLPublicKey | CLAccountHash | CLByteArray;

/**
 * Convert a publickey into a CLKey
 * 
 * @param recipient public key of recipient
 * @returns a CLKey encoding the public key
 */
 export const createRecipientAddress = (recipient: RecipientType): CLKey => {
  if (recipient.clType().toString() === PUBLIC_KEY_TYPE) {
    return new CLKey(new CLAccountHash((recipient as CLPublicKey).toAccountHash()));
  } else {
    return new CLKey(recipient);
  }
};