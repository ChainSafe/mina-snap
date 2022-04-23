import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import { ExplorerAPI } from "./api/api";
import { getPublicKey } from "./rpc/getPublicKey";
import { configure } from "./rpc/configure";
import { signMessage } from "./rpc/signMessage";
import { getState, updateNonce } from "./mina/state";
import { PaymentParams, sendTransaction } from "./rpc/sendTransaction";
import { verifyMessage } from "./rpc/verifyMessage";
import { verifyParams } from "./utils/verifyParams";

declare const wallet: SnapProvider;

export enum Methods {
  Ping = "mina_ping",
  Configure = "mina_configure",
  GetNetwork = "mina_getNetwork",
  GetPublicKey = "mina_getPublicKey",
  GetAccount = "mina_getAccount",
  SignMessage = "mina_signMessage",
  VerifyMessage = "mina_verifyMessage",
  SendTransaction = "mina_sendTransaction",
  SendStakeDelegation = "mina_sendStakeDelegation",
}

wallet.registerRpcMessageHandler(async (origin, request) => {
  if (!("method" in request)) {
    throw new Error("Unsupported request");
  }
  if (typeof request.method !== "string") {
    throw new Error("Unsupported request.method");
  }

  // eslint-ignore
  const params = request.params as any;

  const state = await getState(wallet);
  const client = new Client({ network: state.mina.network });
  const api = new ExplorerAPI("https://devnet.api.minaexplorer.com/");

  if (!state.nonce) {
    const account = await api.getAccount(await getPublicKey(wallet, client));
    let nonce: number;
    if (account.account.nonce == null) {
      nonce = 0;
    } else {
      nonce = account.account.nonce;
    }
    await updateNonce(wallet, nonce);
  }

  switch (request.method) {
    case Methods.Ping:
      return true;
    case Methods.Configure:
      verifyParams(params, { network: ["undefined", "string"] });
      return await configure(wallet, params.network);
    case Methods.GetNetwork:
      return state.mina.network;
    case Methods.GetPublicKey:
      return await getPublicKey(wallet, client);
    case Methods.GetAccount:
      return await api.getAccount(await getPublicKey(wallet, client));
    case Methods.SignMessage:
      verifyParams(params, { message: "string" });
      return await signMessage(wallet, client, params.message);
    case Methods.SendTransaction:
      return await sendTransaction(
        wallet,
        client,
        api,
        request.params as PaymentParams
      );
    case Methods.VerifyMessage:
      verifyParams(params, {
        field: "string",
        message: "string",
        publicKey: "string",
        scalar: "string",
      });
      return await verifyMessage(
        wallet,
        client,
        params.field,
        params.scalar,
        params.publicKey,
        params.message
      );
    case Methods.SendStakeDelegation:
      // client.signStakeDelegation(stakeDelegation: StakeDelegation, privateKey: PrivateKey): Signed<StakeDelegation>;
      throw new Error("WIP method");
    default:
      throw new Error("Unsupported method");
  }
});

export {};
