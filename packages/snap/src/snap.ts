import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import { EmptyMetamaskState } from "./interfaces";
import {getKeypair} from "./mina/keypair";

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
      return '';
    case Methods.GetAddress:
      const keypair = await getKeypair(client, wallet);
      console.warn(keypair);
      return '';
    case Methods.GetBalance:
      return '';
    case Methods.SignMessage:
      return '';
    case Methods.SendMessage:
      return '';
    default:
      throw new Error("Unsupported network error");
  }
});

export {};
