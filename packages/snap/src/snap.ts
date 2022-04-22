import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";

declare const wallet: SnapProvider;

wallet.registerRpcMessageHandler(async (origin, request) => {
  if (!("method" in request)) {
    throw new Error("Unsupported request");
  }
  if (typeof request.method !== "string") {
    throw new Error("Unsupported request.method");
  }

  const client = new Client({ network: "mainnet" });

  // Generate keys
  const keypair = client.genKeys();

  switch (request.method) {
    default:
      throw new Error("Unsupported network error");
  }
});

export {};
