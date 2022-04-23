export interface ISignMessageResponse {
  confirmed: boolean;
  error: unknown | null;
  signature: {
    data: {
      message: string;
      publicKey: string;
    };
    signature: {
      field: string;
      scalar: string;
    }
  };
}

export type Account = {
  account: {
    publicKey: string;
    balance: {
      total: string;
    };
    nonce: number;
  };
};
