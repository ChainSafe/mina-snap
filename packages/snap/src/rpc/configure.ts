import { MetamaskState, Wallet } from "../interfaces";

export async function configure(
  wallet: Wallet,
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
