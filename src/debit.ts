import dayjs from "dayjs";
import { FaspayConfig, FaspayRequest } from "../types/faspay";
import {
  CancelTransactionRequest,
  CancelTransactionResponse,
  CreateTransactionData,
  CreateTransactionRequest,
  CreateTransactionResponse,
  GetPaymentChannelResponse,
  InquiryPaymentStatusRequest,
  InquiryPaymentStatusResponse,
  InstallmentTenor,
  PaymentPlan,
  PaymentType,
} from "../types/debit";
import { generateSignature, idr } from "./utils";
import Faspay from "./faspay";

const baseUrl = {
  dev: "https://debit-sandbox.faspay.co.id",
  prod: "https://web.faspay.co.id",
};

const endpoints = {
  getPaymentChannel: "/cvr/100001/10",
  postDataTransaction: "/cvr/300011/10",
  inquiryPaymentStatus: "/cvr/100004/10",
  cancelTransaction: "/cvr/100005/10",
};

class FaspayDebit extends Faspay {
  constructor(private config: FaspayConfig) {
    super();
    this.baseUrl = config.isProduction ? baseUrl.prod : baseUrl.dev;
  }

  async getPaymentChannel() {
    const signature = generateSignature(
      this.config.userId,
      this.config.password
    );
    const payload: FaspayRequest = {
      request: "Request List of Payment Gateway",
      merchant_id: this.config.merchantId,
      signature,
    };

    return this._request<GetPaymentChannelResponse>(
      endpoints.getPaymentChannel,
      payload
    );
  }

  async createTransaction(data: CreateTransactionData) {
    const billTotal =
      data.total || data.items.reduce((a, b) => a + b.price * b.qty, 0);

    const signature = generateSignature(
      this.config.userId,
      this.config.password,
      data.billNo
    );

    const payload: CreateTransactionRequest = {
      request: "Request List of Payment Gateway",
      merchant: this.config.merchant,
      merchant_id: this.config.merchantId,
      signature,

      bill_no: data.billNo,
      bill_date: dayjs(data.date).format("YYYY-MM-DD HH:mm:ss"),
      bill_expired: dayjs(data.date)
        .add(data.expired || 24, "hours")
        .format("YYYY-MM-DD HH:mm:ss"),

      bill_desc: data.description,
      bill_currency: "IDR",
      bill_gross: data.gross ? idr(data.gross) : undefined,
      bill_miscfee: data.miscFee ? idr(data.miscFee) : undefined,
      bill_total: idr(billTotal),

      payment_channel: data.paymentChannel,
      pay_type: data.paymentType || PaymentType.FullSettlement,
      cust_no: data.customer.no,
      cust_name: data.customer.name,
      msisdn: data.customer.phone,
      email: data.customer.email,

      terminal: "10",

      billing_name: data.billing?.name,
      billing_lastname: data.billing?.lastName,
      billing_address: data.billing?.address,
      billing_address_city: data.billing?.city,
      billing_address_region: data.billing?.region,
      billing_address_state: data.billing?.state,
      billing_address_poscode: data.billing?.postCode,
      billing_msisdn: data.billing?.msisdn,
      billing_address_country_code: data.billing?.countryCode,

      receiver_name_for_shipping: data.shipping?.name,
      shipping_lastname: data.shipping?.lastName,
      shipping_address: data.shipping?.address,
      shipping_address_city: data.shipping?.city,
      shipping_address_region: data.shipping?.region,
      shipping_address_state: data.shipping?.state,
      shipping_address_poscode: data.shipping?.postCode,
      shipping_msisdn: data.shipping?.msisdn,
      shipping_address_country_code: data.shipping?.countryCode,

      item: data.items.map((item) => ({
        id: item.id,
        product: item.product,
        amount: idr(item.price),
        qty: item.qty.toString(),
        payment_plan: item.paymentPlan || PaymentPlan.FullSettlement,
        merchant_id: item.merchantId || this.config.merchantId,
        tenor: item.tenor || InstallmentTenor.FullPayment,
      })),
    };

    return this._request<CreateTransactionResponse>(
      endpoints.postDataTransaction,
      payload
    );
  }

  async getPaymentStatus(trxId: string, billNo: string) {
    const signature = generateSignature(
      this.config.userId,
      this.config.password,
      billNo
    );
    const payload: InquiryPaymentStatusRequest = {
      request: "Inquiry Payment Status",
      merchant_id: this.config.merchantId,
      trx_id: trxId,
      bill_no: billNo,
      signature,
      payment_status_code: "2",
      payment_status_desc: "Payment Success"
    };

    return this._request<InquiryPaymentStatusResponse>(
      endpoints.inquiryPaymentStatus,
      payload
    );
  }

  async cancelTransaction(trxId: string, billNo: string, reason: string) {
    const signature = generateSignature(
      this.config.userId,
      this.config.password,
      billNo
    );
    const payload: CancelTransactionRequest = {
      request: "Canceling Payment",
      merchant_id: this.config.merchantId,
      merchant: this.config.merchant,
      trx_id: trxId,
      bill_no: billNo,
      payment_cancel: reason,
      signature,
    };

    return this._request<CancelTransactionResponse>(
      endpoints.cancelTransaction,
      payload
    );
  }
}

export default FaspayDebit;
