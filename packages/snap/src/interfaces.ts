import {PrivateKey, PublicKey} from "mina-signer/dist/src/TSTypes";

export type MetamaskState = {
  mina: string;
};

export const EmptyMetamaskState: () => MetamaskState = () => ({
  mina: "",
});

export interface Wallet {
  request(options: { method: string; params?: unknown[] }): unknown;
}

export type Keypair = {
  readonly privateKey: PrivateKey;
  readonly publicKey: PublicKey;
};