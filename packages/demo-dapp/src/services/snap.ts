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

    return true;
};

//////////////////////////////////////
//// Methods
//////////////////////////////////////

export enum MinaRPCMethods {
    Ping = "mina_ping",
    Configure = "mina_configure",
    GetPublicKey = "mina_getPublicKey",
    GetAccount = "mina_getAccount",
    SignMessage = "mina_signMessage",
    VerifyMessage = "mina_verifyMessage",
    SendMessage = "mina_sendMessage",
    SendStakeDelegation = "mina_sendStakeDelegation",
}

type Params = { [key: string]: string | number | Params }

export type Tx = {
  to: string;
  fee: string;
  memo?: string;
  amount: string;
};

async function sendSnapMethod<T>(method: MinaRPCMethods, params?: Params): Promise<T> {
    return await getEthereum().request({
        method: 'wallet_invokeSnap',
        params: [defaultSnapId, { method, params }],
    });
}

const pingSnap = (): Promise<true> => sendSnapMethod(MinaRPCMethods.Ping);

export const getPublicKey = () => sendSnapMethod(MinaRPCMethods.GetPublicKey) as Promise<string>;

export type Account = {
    account: {
      publicKey: string;
      balance: {
        total: string;
      };
      nonce: number;
    };
  };
  
  

export const getAccount = () => sendSnapMethod(MinaRPCMethods.GetAccount) as Promise<Account>;

export const getSignMessage = (message: string) => sendSnapMethod(MinaRPCMethods.SignMessage, { message });

export const sendTransaction = (tx: Tx) => sendSnapMethod(MinaRPCMethods.SendMessage, { tx });

export const setNetwork = (network: string) => sendSnapMethod(MinaRPCMethods.Configure, { network })

export const verifyMessage = (field: string, scalar: string, publicKey: string, message: string) =>
    sendSnapMethod(MinaRPCMethods.VerifyMessage, { field, scalar, publicKey, message });

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
