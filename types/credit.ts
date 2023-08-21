import {
  CreateTransactionData,
  TransactionBilling,
  TransactionShipping,
} from "./debit";

export type CreateCreditTxData = Omit<
  CreateTransactionData,
  "billing" | "shipping" | "paymentChannel"
> & {
  billing: TransactionBilling;
  shipping: TransactionShipping & {
    cost?: number;
  };
};

export type CreateCreditTxRequest = {
  payment_method: "1";
  merchantid: string;
  merchant_tranid: string;
  pymt_ind?: string;
  pymt_criteria?: string;
  currencycode: "IDR" | "USD" | "SGD";
  amount: string;
  signature: string;
  custname: string;
  custemail: string;

  /**
   * IP address of the customer. If customer is connecting via a proxy server, please make sure you can provide the actual IP address instead of the proxy server IP address.
   */
  shopper_id: string;

  description: string;
  response_type: ResponseType;

  /**
   * URL that page will be redirected with the transaction response after transaction has been processed. Merchant should translate the response parameter pass back to this URL and display user-friendly message to cardholder. This field is mandatory if ‘RESPONSE_TYPE’ is set to 1 or 2.
   */
  return_url?: string;

  /** Only for Direct API */

  cardno?: string;
  cardname?: string;
  cardtype?: CardType;
  expirymonth?: string;
  expiryyear?: string;
  cardcvc?: string;
  card_issuer_bank_country_code?: string;

  billing_address: string;
  billing_address_city: string;
  billing_address_region: string;
  billing_address_state: string;
  billing_address_poscode: string;
  billing_address_country_code: string;
  receiver_name_for_shipping: string;
  shipping_address: string;
  shipping_address_city: string;
  shipping_address_region: string;
  shipping_address_state: string;
  shipping_address_poscode: string;
  shipping_address_country_code: string;

  shippingcost?: string;
  phone_no: string;
  mparam1?: string;
  mparam2?: string;
};

export enum ResponseType {
  HttpGet = "1",
  HttpPost = "2",
  Stream = "3",
}

export enum CardType {
  MasterCard = "M",
  Visa = "V",
  JCB = "J",
  Amex = "A",
}
