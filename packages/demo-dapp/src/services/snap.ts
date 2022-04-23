import { defaultSnapId } from "../config";
import { getEthereum, hasMetaMask } from "../utils/ethereum";

export const enableSnap = async (): Promise<true> => {
    if (!hasMetaMask()) {
        throw new Error("Metamask is not installed");
    }
    if (!(await isMetamaskSnapsSupported())) {
        throw new Error("Current Metamask version doesn't support snaps");
    }

    await getEthereum().request({
        method: "wallet_enable",
        params: [
            {
                [`wallet_snap_${defaultSnapId}`]: { version: "latest" },
            },
        ],
    });

    // wait to load snap and return true on finish
    for (; ;) {
        try {
            if (await pingSnap()) return true;
        } catch {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};

//////////////////////////////////////
//// Methods
//////////////////////////////////////

export enum MinaRPCMethods {
    Ping = "mina_ping",
    Configure = "mina_configure",
    GetPublicKey = "mina_getPublicKey",
    GetBalance = "mina_getBalance",
    SignMessage = "mina_signMessage",
    SendMessage = "mina_sendMessage",
    SendStakeDelegation = "mina_sendStakeDelegation",
}

type Params = { [key: string]: string | number | Params }

async function sendSnapMethod<T>(method: MinaRPCMethods, params?: Params): Promise<T> {
    return await getEthereum().request({
        method: 'wallet_invokeSnap',
        params: [defaultSnapId, { method, params }],
    });
}

const pingSnap = (): Promise<true> => sendSnapMethod(MinaRPCMethods.Ping);

export const getPublicKey = () => sendSnapMethod(MinaRPCMethods.GetPublicKey);

export const getSignMessage = (message: string) => sendSnapMethod(MinaRPCMethods.SignMessage, { message });

export const setNetwork = (network: string) => sendSnapMethod(MinaRPCMethods.Configure, { network })

//////////////////////////////////////
//// Helpers
//////////////////////////////////////

export async function isMetamaskSnapsSupported(): Promise<boolean> {
    try {
        await getEthereum().request({
            method: 'wallet_getSnaps',
        });
        return true;
    } catch (e) {
        return false;
    }
}
