import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import { getPublicKey } from "./rpc/getPublicKey";
import { EmptyMetamaskState, MetamaskState } from "./interfaces";
import { configure } from "./rpc/configure";
import { signMessage } from "./rpc/signMessage";

declare const wallet: SnapProvider;

export enum Methods {
  Configure = "mina_configure",
  GetPublicKey = "mina_getPublicKey",
  GetBalance = "mina_getBalance",
  SignMessage = "mina_signMessage",
  SendMessage = "mina_sendMessage",
}

wallet.registerRpcMessageHandler(async (origin, request) => {
  if (!("method" in request)) {
    throw new Error("Unsupported request");
  }
  if (typeof request.method !== "string") {
    throw new Error("Unsupported request.method");
  }

  const state: MetamaskState = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as MetamaskState;
  if (!state) {
    await wallet.request({
      method: "snap_manageState",
      params: ["update", EmptyMetamaskState()],
    });
  }
  let client = new Client({ network: state.mina.network });

  switch (request.method) {
    case Methods.Configure:
      const newState = await configure(
        wallet,
        (request.params as { network: string }).network
      );
      client = new Client({ network: newState.mina.network });
    case Methods.GetPublicKey:
      return getPublicKey(wallet, client);
    case Methods.GetBalance:
      throw new Error("Unsupported network error");
    case Methods.GetBalance:
      throw new Error("");
    case Methods.SignMessage:
      return await signMessage(
        wallet,
        client,
        (request.params as { message: string }).message
      );
    case Methods.SendMessage:
      throw new Error("Unsupported network error");
    default:
      throw new Error("Unsupported network error");
  }
});

export {};
