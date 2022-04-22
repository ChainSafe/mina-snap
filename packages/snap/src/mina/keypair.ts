import Client from "mina-signer";
import {
  deriveBIP44AddressKey,
  JsonBIP44CoinTypeNode,
} from "@metamask/key-tree";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bs58 from "bs58check";
import { Keypair } from "mina-signer/dist/src/TSTypes";
import { SnapProvider } from "@metamask/snap-types";

const cointType = 12586;

export async function getKeypair(
  client: Client,
  wallet: SnapProvider
): Promise<Keypair> {
  const bip44Node = (await wallet.request({
    method: `snap_getBip44Entropy_${cointType}`,
    params: [],
  })) as JsonBIP44CoinTypeNode;

  const extendedPrivateKey = deriveBIP44AddressKey(bip44Node, {
    account: 0,
    address_index: 0,
    change: 0,
  });

  const extendedPrivateKeyShort = extendedPrivateKey.slice(0, 32);
  extendedPrivateKeyShort[0] &= 0x3f;

  const childPrivateKey = reverseBytes(extendedPrivateKeyShort);
  const privateKey = new Uint8Array([...[90, 1], ...childPrivateKey]);
  const privateKeyEncoded = bs58.encode(privateKey);
  const publicKey = client.derivePublicKey(privateKeyEncoded);

  return { privateKey: privateKeyEncoded, publicKey };
}

const reverseBytes = (bytes: any) => {
  const uint8 = new Uint8Array(bytes);
  const reversedBytes = new Buffer(uint8.reverse());
  return reversedBytes;
};
