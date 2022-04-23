import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import { ExplorerAPI } from "./api/api";
import { getPublicKey } from "./rpc/getPublicKey";
import { configure } from "./rpc/configure";
import { signMessage } from "./rpc/signMessage";
import { getState, updateNonce } from "./mina/state";
import { PaymentParams, signPayment } from "./rpc/signPayment";
import { verifyMessage } from "./rpc/verifyMessage";

declare const wallet: SnapProvider;

export enum Methods {
  Ping = "mina_ping",
  Configure = "mina_configure",
  GetPublicKey = "mina_getPublicKey",
  GetAccount = "mina_getAccount",
  SignMessage = "mina_signMessage",
  VerifyMessage = "mina_verifyMessage",
  SendMessage = "mina_sendMessage",
  SendStakeDelegation = "mina_sendStakeDelegation",
}

wallet.registerRpcMessageHandler(async (origin, request) => {
  if (!("method" in request)) {
    throw new Error("Unsupported request");
  }
  if (typeof request.method !== "string") {
    throw new Error("Unsupported request.method");
  }

  const state = await getState(wallet);
  const client = new Client({ network: state.mina.network });
  const api = new ExplorerAPI("https://devnet.api.minaexplorer.com/");

  if (!state.nonce) {
    const account = await api.getAccount(await getPublicKey(wallet, client));
    await updateNonce(wallet, account.account.nonce);
  }

  switch (request.method) {
    case Methods.Ping:
      return true;
    case Methods.Configure:
      return await configure(
        wallet,
        (request.params as { network: string }).network
      );
    case Methods.GetPublicKey:
      return await getPublicKey(wallet, client);
    case Methods.GetAccount:
      return await api.getAccount(await getPublicKey(wallet, client));
    case Methods.SignMessage:
      return await signMessage(
        wallet,
        client,
        (request.params as { message: string }).message
      );
    case Methods.SendMessage:
      return await signPayment(wallet, client, request.params as PaymentParams);
    case Methods.VerifyMessage:
      return await verifyMessage(
        wallet,
        client,
        (request.params as { field: string }).field,
        (request.params as { scalar: string }).scalar,
        (request.params as { publicKey: string }).publicKey,
        (request.params as { message: string }).message
      );
    case Methods.SendStakeDelegation:
      // client.signStakeDelegation(stakeDelegation: StakeDelegation, privateKey: PrivateKey): Signed<StakeDelegation>;
      throw new Error("WIP method");
    default:
      throw new Error("Unsupported method");
  }
});

export {};
