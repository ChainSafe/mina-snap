import { Network } from "mina-signer/dist/src/TSTypes";

export type MetamaskState = {
  mina: {
    network: Network;
  };
};

export interface MessageRequest {
  to: string;
}
