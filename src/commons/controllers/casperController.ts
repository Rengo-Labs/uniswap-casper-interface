import { SignerInterface } from '../interfaces/casperSignerInterface';

export async function getActivePublicKey(Wallet: SignerInterface): Promise<string | boolean> {
    try {
        return await Wallet.getActivePublicKey()
    } catch {
        return false;
    }
}

export async function isConnected(Wallet: SignerInterface): Promise<boolean> {
    try {
        return await Wallet.isConnected()
    } catch {
        return false;
    }
}

export async function disconnectFromSite(Wallet: SignerInterface): Promise<void> {
    console.log(Wallet)
    await Wallet.disconnectFromSite()
}