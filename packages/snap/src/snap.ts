import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import { getPublicKey } from "./rpc/getPublicKey";
import { configure } from "./rpc/configure";
import { signMessage } from "./rpc/signMessage";
import { getState } from "./mina/state";

declare const wallet: SnapProvider;

export enum Methods {
  Ping = "mina_ping",
  Configure = "mina_configure",
  GetPublicKey = "mina_getPublicKey",
  GetBalance = "mina_getBalance",
  SignMessage = "mina_signMessage",
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
    case Methods.GetBalance:
      throw new Error("WIP method");
    case Methods.SignMessage:
      return await signMessage(
        wallet,
        client,
        (request.params as { message: string }).message
      );
    case Methods.SendMessage:
      // client.signPayment(payment: Payment, privateKey: PrivateKey): Signed<Payment>;
      throw new Error("WIP method");
      case Methods.SendStakeDelegation:
      // client.signStakeDelegation(stakeDelegation: StakeDelegation, privateKey: PrivateKey): Signed<StakeDelegation>;
      throw new Error("WIP method");
    default:
      throw new Error("Unsupported method");
  }
});

export {};
