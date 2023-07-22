import fetch from "node-fetch";
import dayjs from "dayjs";
import {
  CancelTransactionRequest,
  CancelTransactionResponse,
  CreateTransactionData,
  CreateTransactionRequest,
  CreateTransactionResponse,
  FaspayConfig,
  FaspayRequest,
  FaspayResponse,
  GetPaymentChannelResponse,
  InquiryPaymentStatusRequest,
  InquiryPaymentStatusResponse,
  PaymentPlan,
  ResponseCode,
} from "../types/faspay";
import { generateSignature, idr } from "./utils";

const endpoints = {
  GET_PAYMENT_CHANNEL: "/cvr/100001/10",
  POST_DATA_TRANSACTION: "/cvr/300011/10",
  INQUIRY_PAYMENT_STATUS: "/cvr/100004/10",
  CANCEL_TRANSACTION: "/cvr/100005/10",
};

class Faspay {
  constructor(private config: FaspayConfig) {}

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
      endpoints.GET_PAYMENT_CHANNEL,
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
      pay_type: "1",
      cust_no: data.custId,
      cust_name: data.custName,
      msisdn: data.custPhone,
      email: data.custEmail,
      terminal: "10",
      item: data.items.map((item) => ({
        id: item.id,
        product: item.product,
        amount: idr(item.price),
        qty: item.qty.toString(),
        payment_plan: PaymentPlan.FullSettlement,
        merchant_id: this.config.merchantId,
      })),
    };

    return this._request<CreateTransactionResponse>(
      endpoints.POST_DATA_TRANSACTION,
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
    };

    return this._request<InquiryPaymentStatusResponse>(
      endpoints.INQUIRY_PAYMENT_STATUS,
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
      endpoints.CANCEL_TRANSACTION,
      payload
    );
  }

  private async _request<T extends FaspayResponse>(url: string, body?: any) {
    try {
      const _url = this.config.baseUrl + url;
      const response = await fetch(_url, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (response.status !== 200) {
        throw new Error(response.statusText);
      }

      const data = (await response.json()) as T;

      if (data.response_code !== ResponseCode.Success) {
        throw new Error(data.response_desc);
      }

      return data;
    } catch (err) {
      console.error(err);
      throw new Error("Payment gateway error!");
    }
  }
}

export default Faspay;
