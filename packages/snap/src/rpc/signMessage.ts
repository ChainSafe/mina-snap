import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import type { Message, Signed } from "mina-signer/dist/src/TSTypes";
import { getKeypair } from "../mina/keypair";

export function signMessage(
  wallet: SnapProvider,
  client: Client,
  message: string
): Signed<Message> {
  const keypair = getKeypair(client, wallet);
  return client.signMessage(message, keypair);
}
