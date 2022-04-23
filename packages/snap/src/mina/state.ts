import { SnapProvider } from "@metamask/snap-types";
import { Maybe } from "@metamask/providers/dist/utils";
import { MetamaskState } from "../types";

export const getState = async (
  wallet: SnapProvider
): Promise<MetamaskState> => {
  const state: Maybe<MetamaskState> = await wallet.request<MetamaskState>({
    method: "snap_manageState",
    params: ["get"],
  });
  if (!state) {
    const emptyState = EmptyMetamaskState();
    await wallet.request({
      method: "snap_manageState",
      params: ["update", emptyState],
    });
    return emptyState;
  }
  // TODO: GOOD TO HAVE validate if there is no missing fields if there is update state with missing one
  return state as MetamaskState;
};

export const EmptyMetamaskState: () => MetamaskState = () => ({
  mina: {
    network: "mainnet",
  },
});
