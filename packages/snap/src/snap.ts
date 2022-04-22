import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import { EmptyMetamaskState } from "./interfaces";
import { signMessage } from "./rpc/signMessage";

declare const wallet: SnapProvider;

export enum Methods {
  Configure = "mina_configure",
  GetAddress = "mina_getAddress",
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
      break;
    case Methods.GetAddress:
      break;
    case Methods.GetBalance:
      break;
    case Methods.SignMessage:
      return signMessage(
        wallet,
        client,
        (request.params as { message: string }).message
      );
    case Methods.SendMessage:
      break;
    default:
      throw new Error("Unsupported network error");
  }
});

export {};
