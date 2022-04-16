export interface SignerInterface{
    isConnected: () => Promise<boolean>,
    getActivePublicKey: () => Promise<string>,
    disconnectFromSite: () => Promise<void>
}