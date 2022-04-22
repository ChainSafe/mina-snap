import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import { getKeypair } from "../mina/keypair";

export function getPublicKey(wallet: SnapProvider, client: Client): string {
  const keypair = getKeypair(client, wallet);
  return keypair.publicKey;
}
