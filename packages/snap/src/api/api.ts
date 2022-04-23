import { Balance } from "./types";

export class ExplorerAPI {
  uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  async getBalance(publicKey: string): Promise<Balance> {
    const response = await fetch(`${this.uri}/accounts/${publicKey}`);
    return (await response.json()) as Balance;
  }
}
