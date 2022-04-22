import Client from "mina-signer";
import { Keypair } from "mina-signer/dist/src/TSTypes";

export function getKeypair(client: Client): Keypair {
  return client.genKeys();
}
