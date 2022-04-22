import type { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import { Message, Signed } from "mina-signer/dist/src/TSTypes";
import { getKeypair } from "../mina/keypair";
import { showConfirmationDialog } from "../prompts/confirmation";
import { messageCreator } from "../prompts/message";

export type SignMessageResponse = {
  signature: Signed<Message>;
  confirmed: boolean;
  error: Error;
};

export async function signMessage(
  wallet: SnapProvider,
  client: Client,
  message: string
): Promise<SignMessageResponse> {
  try {
    const keypair = getKeypair(client, wallet);

    const confirmation = await showConfirmationDialog(wallet, {
      description: `It will be signed with address: ${keypair.publicKey}`,
      prompt: `Do you want to sign this message?`,
      textAreaContent: messageCreator([
        { message: "message:", value: message },
      ]),
    });

    if (!confirmation) {
      return { confirmed: false, error: null, signature: null };
    }

    const signature = client.signMessage(message, keypair);
    return {
      confirmed: true,
      error: null,
      signature: signature,
    };
  } catch (e) {
    return { confirmed: false, error: e, signature: null };
  }
}
