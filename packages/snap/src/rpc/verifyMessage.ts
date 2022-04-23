import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";

export async function verifyMessage(
  wallet: SnapProvider,
  client: Client,
  field: string,
  scalar: string,
  publicKey: string,
  message: string,
): Promise<boolean> {
    return client.verifyMessage({
      signature: { field, scalar },
      data: { publicKey, message },
    });
}
