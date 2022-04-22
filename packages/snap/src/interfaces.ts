import { Network } from "mina-signer/dist/src/TSTypes";

export type MetamaskState = {
  mina: {
    network: Network;
  };
};

export const EmptyMetamaskState: () => MetamaskState = () => ({
  mina: {
    network: "mainnet",
  },
});
