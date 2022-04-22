import type { SnapProvider } from "@metamask/snap-types";
import { MetamaskState } from "../interfaces";

export async function configure(
  wallet: SnapProvider,
  network: string
): Promise<MetamaskState> {
  await wallet.request({
    method: "snap_manageState",
    params: [
      "update",
      {
        mina: {
          network: network,
        },
      },
    ],
  });
  return (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as MetamaskState;
}
