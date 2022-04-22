import Client from "mina-signer";
import {Keypair, Wallet } from "src/interfaces";
import {deriveBIP44AddressKey, JsonBIP44CoinTypeNode} from "@metamask/key-tree";
import bs58 from "bs58";

const derivationPath = "m/44'/12586'/0'/0/0";

const t = 'EKDmEM8C4yqASzmKL1rRYj45vGUbheQXV1xCsW4Cxj6sGPt1XS1x';

// privateKey: 'EKEC9T7ayE1M46ch9v6Nxwyq69zJ63kxtT6CqL6LqhixQLKbiWyG'
// publicKey: 'B62qkHxCsZGbcsjPXT19fHHmynemKnCPWUH9yPzp59gWwQuSeakERfq'

export async function getKeypair(client: Client, wallet: Wallet): Promise<Keypair> {
  console.warn(client.genKeys());

  const [, , coinType, account, change, addressIndex] = derivationPath.split('/');
  const bip44Code = coinType.replace("\'", "");

  console.warn('bip44Code', bip44Code);

  const bip44Node = await wallet.request({
    method: `snap_getBip44Entropy_${bip44Code}`,
    params: []
  }) as JsonBIP44CoinTypeNode;

  console.warn('bip44Node', bip44Node);

  const extendedPrivateKey = deriveBIP44AddressKey(bip44Node, {
    account: parseInt(account),
    address_index: parseInt(addressIndex),
    change: parseInt(change),
  });

  console.warn('extendedPrivateKey', extendedPrivateKey);

  const privateKey = bs58.encode(extendedPrivateKey).substring(0, 52);
  console.warn('privateKey', privateKey);
  const publicKey = client.derivePublicKey(privateKey);

  console.warn({ privateKey, publicKey });

  console.warn(client.verifyKeypair({ privateKey, publicKey }));

  return { privateKey, publicKey };
}
