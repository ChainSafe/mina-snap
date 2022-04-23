import type { SnapProvider } from "@metamask/snap-types";

export async function configure(
  wallet: SnapProvider,
  network: string
): Promise<true> {
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
  return true;
}
