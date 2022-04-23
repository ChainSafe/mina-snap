import { SnapProvider } from "@metamask/snap-types";
import Client from "mina-signer";
import { Payment, Signed } from "mina-signer/dist/src/TSTypes";
import { getKeypair } from "../mina/keypair";
import { getState, updateNonce } from "../mina/state";
import { showConfirmationDialog } from "../prompts/confirmation";
import { messageCreator } from "../prompts/message";

export type PaymentParams = {
  to: string;
  fee: string;
  memo?: string;
  amount: string;
};

export type SignMessageResponse = {
  signedPayment: Signed<Payment>;
  confirmed: boolean;
  error: Error;
};

export async function signPayment(
  wallet: SnapProvider,
  client: Client,
  payment: PaymentParams
): Promise<SignMessageResponse> {
  try {
    const state = await getState(wallet);
    const kp = await getKeypair(client, wallet);

    console.log(payment);

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
        signedPayment: null,
      };
    }

    const signedPayment = client.signPayment(
      {
        amount: payment.amount,
        fee: payment.fee,
        from: kp.publicKey,
        memo: payment.memo,
        nonce: state.nonce,
        to: payment.to,
      },
      kp.privateKey
    );
    await updateNonce(wallet, state.nonce + 1);
    return {
      confirmed: true,
      error: null,
      signedPayment: signedPayment,
    };
  } catch (error) {
    return {
      confirmed: false,
      error: error,
      signedPayment: null,
    };
  }
}
