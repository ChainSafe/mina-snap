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
}
