export type MetamaskState = {
  mina: string;
};

export const EmptyMetamaskState: () => MetamaskState = () => ({
  mina: "",
});

export interface Wallet {
  request(options: { method: string; params?: unknown[] }): unknown;
}
