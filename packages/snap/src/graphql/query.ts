import { gql } from "@apollo/client";

export type Balance = {
  total: number;
};

export const GET_BALANCE = gql`
  query accountByKey($publicKey: String!) {
    accountByKey(publicKey: $publicKey) {
      balance {
        total
        liquid
        locked
        liquidUnconfirmed
        unconfirmedTotal
      }
    }
  }
`;
