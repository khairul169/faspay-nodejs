import { FaspayRequest, FaspayResponse } from "./faspay";
export declare enum PaymentType {
    FullSettlement = "1",
    Installment = "2",
    Mixed = "3"
}
export declare enum PaymentPlan {
    FullSettlement = "1",
    Installement = "2"
}
export declare enum PaymentStatusCode {
    Unprocessed = "0",
    InProcess = "1",
    Success = "2",
    Reserval = "4",
    NotFound = "5",
    Cancelled = "8",
    Unknown = "9"
}
export declare enum InstallmentTenor {
    FullPayment = "00",
    ThreeMonths = "03",
    SixMonths = "06",
    OneYear = "12"
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
    billing_name?: string;
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
    shipping_msisdn?: string;
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
export type CreateTransactionResponse = FaspayResponse & {
    trx_id: string;
    bill_no: string;
    bill_items: CreateTransactionItemData[];
    redirect_url: string;
};
export type TransactionCustomer = {
    no: string;
    name: string;
    phone: string;
    email: string;
};
export type TransactionItem = {
    id?: string;
    product: string;
    price: number;
    qty: number;
    merchantId?: string;
    tenor?: string;
    paymentPlan?: PaymentPlan;
};
export type TransactionBilling = {
    name: string;
    lastName?: string;
    address?: string;
    city?: string;
    region?: string;
    state?: string;
    postCode?: string;
    msisdn?: string;
    countryCode?: string;
};
export type TransactionShipping = TransactionBilling;
export type CreateTransactionData = {
    billNo: string;
    date?: Date;
    expired?: number;
    description: string;
    gross?: number;
    miscFee?: number;
    total?: number;
    paymentChannel: string;
    paymentType?: PaymentType;
    customer: TransactionCustomer;
    billing?: TransactionBilling;
    shipping?: TransactionBilling;
    items: TransactionItem[];
};
export type InquiryPaymentStatusRequest = FaspayRequest & {
    trx_id: string;
    bill_no: string;
    payment_status_code: string;
    payment_status_desc: string;
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
