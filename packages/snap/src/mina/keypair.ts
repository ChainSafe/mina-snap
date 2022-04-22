import Client from "mina-signer";
import { Keypair } from "mina-signer/dist/src/TSTypes";
import { Wallet } from "src/interfaces";

export function getKeypair(client: Client, wallet: Wallet): Keypair {
  return client.genKeys();
}
