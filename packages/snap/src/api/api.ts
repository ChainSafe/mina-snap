import { Payment, Signature } from "mina-signer/dist/src/TSTypes";
import { Account } from "./types";

export class ExplorerAPI {
  uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  async getAccount(publicKey: string): Promise<Account> {
    const response = await fetch(`${this.uri}/accounts/${publicKey}`);
    return (await response.json()) as Account;
  }

  async broadcastTx(
    pu: string,
    signature: Signature,
    payment: Payment
  ): Promise<unknown> {
    const response = await fetch(`${this.uri}/broadcast/transaction`, {
      body: JSON.stringify({
        payload: payment,
        publicKey: pu,
        signature: signature,
      }),
      method: "POST",
    });
    return await response.json();
  }
}
