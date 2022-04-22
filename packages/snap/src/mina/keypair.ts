import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import { Keypair } from "mina-signer/dist/src/TSTypes";

export function getKeypair(client: Client, wallet: SnapProvider): Keypair {
  return client.genKeys();
}
