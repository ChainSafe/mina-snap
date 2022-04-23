import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import {Message, Signed} from "mina-signer/dist/src/TSTypes";

export async function verifyMessage(
  wallet: SnapProvider,
  client: Client,
  field: string,
  scalar: string,
  publicKey: string,
  message: string
): Promise<boolean> {
  return client.verifyMessage({
    signature: {
      string: message,
      signer: publicKey,
      signature: {field, scalar},
    },
    data: {publicKey, message}
  } as unknown as Signed<Message>);
}
