export type MetamaskState = {
  mina: string;
};

export const EmptyMetamaskState: () => MetamaskState = () => ({
  mina: "",
});
