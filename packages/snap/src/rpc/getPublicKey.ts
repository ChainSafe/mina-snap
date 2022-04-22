import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import { getKeypair } from "../mina/keypair";

export async function getPublicKey(
  wallet: SnapProvider,
  client: Client
): Promise<string> {
  const keypair = await getKeypair(client, wallet);
  return keypair.publicKey;
}
