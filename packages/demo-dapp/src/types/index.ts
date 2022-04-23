export interface ISignMessageResponse {
  confirmed: boolean;
  error: unknown | null;
  signature: {
    data: {
      message: string;
      publicKey: string;
    };
    signature: {
      signature: {
        field: string;
        scalar: string;
      }
      signer: string;
      string: string;
    }
  };
}


export type ITransactionResponse = {
    confirmed: boolean;
    error: Error;
    tx: {
        result: {
            payment: {
              hash: string;
            }
        }
    }
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
