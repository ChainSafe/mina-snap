import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import { EmptyMetamaskState } from "./interfaces";
import { getPublicKey } from "./rpc/getPublicKey";
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

  const state = await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  });
  if (!state) {
    await wallet.request({
      method: "snap_manageState",
      params: ["update", EmptyMetamaskState()],
    });
  }
  const client = new Client({ network: "mainnet" });

  switch (request.method) {
    case Methods.Configure:
      throw new Error("Unsupported network error");
    case Methods.GetPublicKey:
      return getPublicKey(wallet, client);
    case Methods.GetBalance:
      throw new Error("Unsupported network error");
    case Methods.SignMessage:
      return signMessage(
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
