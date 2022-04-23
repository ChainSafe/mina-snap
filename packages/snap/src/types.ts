import { Network } from "mina-signer/dist/src/TSTypes";

export type MetamaskState = {
  mina: {
    network: Network;
  };
  nonce?: number;
  transactions: unknown[];
};

export interface MessageRequest {
  to: string;
}
