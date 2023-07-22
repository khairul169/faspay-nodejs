export type FaspayConfig = {
  baseUrl: string;
  merchantId: string;
  merchant: string;
  userId: string;
  password: string;
  creditAccount?: string;
  creditPassword?: string;
};

export type FaspayRequest = {
  request: string;
  merchant_id: string;
  merchant?: string;
  signature: string;
};

export type FaspayResponse = {
  response: string;
  merchant_id: string;
  merchant: string;
  response_code: ResponseCode;
  response_desc: string;
};

export enum ResponseCode {
  Success = "00",
  InvalidMerchant = "03",
  InvalidAmount = "13",
  InvalidOrder = "14",
  CancelledByMerchant = "17",
  InvalidCustomer = "18",
  SubscriptionExpired = "21",
  FormatError = "30",
  FunctionNotSupported = "40",
  OrderExpired = "54",
  IncorrectUserOrPassword = "55",
  SecurityViolation = "56",
  NotActiveOrSuspended = "63",
  InternalError = "66",
  PaymentWasReversal = "80",
  AlreadyBeenPaid = "81",
  UnregisteredEntity = "82",
  ParameterIsMandatory = "83",
  UnregisteredParameters = "84",
  InsufficientParameters = "85",
  SystemMalfunction = "96",
}

export type GetPaymentChannelResponse = FaspayResponse & {
  payment_channel: PaymentChannel[];
};

export type PaymentChannel = {
  pg_code: string;
  pg_name: string;
};

export type CreateTransactionRequest = FaspayRequest & {
  bill_no: string;
  bill_reff?: string;
  bill_date: string;
  bill_expired: string;
  bill_desc: string;
  bill_currency: string;
  bill_gross?: string;
  bill_miscfee?: string;
  bill_total: string;
  cust_no: string;
  cust_name: string;
  payment_channel: string;
  pay_type: string;
  bank_userid?: string;
  msisdn: string;
  email: string;
  terminal: string;
  billing_name?: string; // Billing name  for OVO
  billing_lastname?: string;
  billing_address?: string;
  billing_address_city?: string;
  billing_address_region?: string;
  billing_address_state?: string;
  billing_address_poscode?: string;
  billing_msisdn?: string;
  billing_address_country_code?: string;
  receiver_name_for_shipping?: string;
  shipping_lastname?: string;
  shipping_address?: string;
  shipping_address_city?: string;
  shipping_address_region?: string;
  shipping_address_state?: string;
  shipping_address_poscode?: string;
  shipping_msisdn?: string; // Shipping phone number
  shipping_address_country_code?: string;
  item: CreateTransactionItemData[];
  reserve1?: string;
  reserve2?: string;
};

export type CreateTransactionItemData = {
  id?: string;
  product: string;
  amount: string;
  qty: string;
  payment_plan: PaymentPlan;
  merchant_id: string;
  tenor?: string;
};

export enum PaymentPlan {
  FullSettlement = "1",
  Installement = "2",
}

export type CreateTransactionResponse = FaspayResponse & {
  trx_id: string;
  bill_no: string;
  bill_items: CreateTransactionItemData[];
  redirect_url: string;
};

export type TransactionItem = {
  id?: string;
  product: string;
  price: number;
  qty: number;
};

export type CreateTransactionData = {
  billNo: string;
  date?: Date; // default current date time
  expired?: number; // hours, default 24 hours
  description: string;
  gross?: number;
  miscFee?: number;
  total?: number;
  paymentChannel: string;
  custId: string;
  custName: string;
  custPhone: string;
  custEmail: string;
  items: TransactionItem[];
};

export type InquiryPaymentStatusRequest = FaspayRequest & {
  trx_id: string;
  bill_no: string;
};

export type InquiryPaymentStatusResponse = FaspayResponse & {
  trx_id: string;
  bill_no: string;
  payment_reff: string;
  payment_date: string;
  payment_status_code: PaymentStatusCode;
  payment_status_desc: string;
  payment_total: string;
};

export enum PaymentStatusCode {
  Unprocessed = "0",
  InProcess = "1",
  Success = "2",
  Reserval = "4",
  NotFound = "5",
  Cancelled = "8",
  Unknown = "9",
}

export type CancelTransactionRequest = FaspayRequest & {
  trx_id: string;
  bill_no: string;
  payment_cancel: string;
};

export type CancelTransactionResponse = FaspayResponse & {
  trx_id: string;
  bill_no: string;
  trx_status_code: string;
  trx_status_desc: string;
  payment_status_code: PaymentStatusCode;
  payment_status_desc: string;
  payment_cancel_date: string;
  payment_cancel: string;
};
