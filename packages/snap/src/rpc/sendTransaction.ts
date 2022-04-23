import { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import { ExplorerAPI } from "src/api/api";
import { getKeypair } from "../mina/keypair";
import { getState, updateNonce, updateTransactions } from "../mina/state";
import { showConfirmationDialog } from "../prompts/confirmation";
import { messageCreator } from "../prompts/message";

export type PaymentParams = {
  to: string;
  fee: string;
  memo?: string;
  amount: string;
};

export type SignMessageResponse = {
  tx: unknown;
  confirmed: boolean;
  error: Error;
};

export async function sendTransaction(
  wallet: SnapProvider,
  client: Client,
  api: ExplorerAPI,
  payment: PaymentParams
): Promise<SignMessageResponse> {
  try {
    const state = await getState(wallet);
    const kp = await getKeypair(client, wallet);

    const confirmation = await showConfirmationDialog(wallet, {
      description: `It will be signed with address: ${kp.publicKey}`,
      prompt: `Do you want to sign this payment?`,
      textAreaContent: messageCreator([
        { message: "amount:", value: payment.amount },
        { message: "fee", value: payment.fee },
        { message: "from", value: kp.publicKey },
        { message: "nonce", value: state.nonce },
        { message: "to", value: payment.to },
      ]),
    });
    if (!confirmation) {
      return {
        confirmed: false,
        error: null,
        tx: null,
      };
    }

    const pymn = {
      amount: payment.amount,
      fee: payment.fee,
      from: kp.publicKey,
      memo: payment.memo,
      nonce: state.nonce,
      to: payment.to,
    };
    const signedPayment = client.signPayment(pymn, kp.privateKey);

    const tx = await api.broadcastTx(
      kp.publicKey,
      signedPayment.signature,
      pymn
    );
    if ((tx as { error: string }).error) {
      throw new Error((tx as { error: string }).error);
    }

    await updateNonce(wallet, state.nonce + 1);
    return {
      confirmed: true,
      error: null,
      tx: tx,
    };
  } catch (error) {
    return {
      confirmed: false,
      error: error,
      tx: null,
    };
  }
}
