import Client from "mina-signer";
import { Message, Signed } from "mina-signer/dist/src/TSTypes";
import { Wallet } from "src/interfaces";
import { getKeypair } from "src/mina/keypair";

export function signMessage(
  wallet: Wallet,
  client: Client,
  message: string
): Signed<Message> {
  const keypair = getKeypair(client, wallet);
  return client.signMessage(message, keypair);
}
