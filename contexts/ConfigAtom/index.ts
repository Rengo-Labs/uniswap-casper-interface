import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'


export const showConfig = atomWithStorage<Boolean>("config", false)
export const setConfig = atom(
    (get) => get(showConfig),
    (get, set) => set(showConfig, !get(showConfig)))

export function spreadEvent() {
    window.addEventListener('signer:connected', msg => {
        //setSignerLocked(!msg.detail.isUnlocked)
        //setSignerConnected(true)
        //localStorage.setItem("Address", msg.detail.activeKey)
        //props.setActivePublicKey(msg.detail.activeKey)
    });
    window.addEventListener('signer:disconnected', msg => {
        // setSignerLocked(!msg.detail.isUnlocked)
        // setSignerConnected(false)
        // localStorage.setItem("Address", msg.detail.activeKey)
        // props.setActivePublicKey(msg.detail.activeKey)
    });
    window.addEventListener('signer:tabUpdated', msg => {
        // setSignerLocked(!msg.detail.isUnlocked)
        // setSignerConnected(msg.detail.isConnected)
        // localStorage.setItem("Address", msg.detail.activeKey)
        // props.setActivePublicKey(msg.detail.activeKey)
    });
    window.addEventListener('signer:activeKeyChanged', msg => {
        // localStorage.setItem("Address", msg.detail.activeKey)
        // props.setActivePublicKey(msg.detail.activeKey)
    });
    window.addEventListener('signer:locked', msg => {
        // setSignerLocked(!msg.detail.isUnlocked);
        // localStorage.setItem("Address", msg.detail.activeKey)
        // props.setActivePublicKey(msg.detail.activeKey)
    });
    window.addEventListener('signer:unlocked', msg => {
        // setSignerLocked(!msg.detail.isUnlocked)
        // setSignerConnected(msg.detail.isConnected)
        // localStorage.setItem("Address", msg.detail.activeKey)
        // props.setActivePublicKey(msg.detail.activeKey)
    });
    window.addEventListener('signer:initialState', msg => {
        // console.log("Initial State: ", msg.detail);

        // setSignerLocked(!msg.detail.isUnlocked)
        // setSignerConnected(msg.detail.isConnected)
        // localStorage.setItem("Address", msg.detail.activeKey)
        // props.setActivePublicKey(msg.detail.activeKey)
    });
}

async function checkConnection() {

    try {
        return await Signer.isConnected();
    }
    catch {
        let variant = "Error";
        //enqueueSnackbar('Unable to connect', { variant });
    }
}

async function getActiveKeyFromSigner() {
    try {
        return await Signer.getActivePublicKey();
    }
    catch {
        let variant = "Error";
        //enqueueSnackbar('Unable to get Active Public Key', { variant });
    }

}

async function connectToSigner() {
    try {
        //return await Signer.sendConnectionRequest();
    }
    catch {
        let variant = "Error";
        //enqueueSnackbar('Unable to send Connection Request', { variant });
    }
}