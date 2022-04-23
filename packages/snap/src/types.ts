import { Network } from "mina-signer/dist/src/TSTypes";

export type MetamaskState = {
  mina: {
    network: Network;
  };
  nonce?: number;
};

export interface MessageRequest {
  to: string;
}
