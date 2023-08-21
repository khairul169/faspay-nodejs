import dayjs from "dayjs";
import { FaspayConfig } from "../types/faspay";
import { idr, idr2, signature2 } from "./utils";
import Faspay from "./faspay";
import {
  CreateCreditTxData,
  CreateCreditTxRequest,
  ResponseType,
} from "../types/credit";

const baseUrl = {
  dev: "https://fpg-sandbox.faspay.co.id",
  prod: "https://fpg.faspay.co.id",
};

const endpoints = {
  createTransaction: "/payment",
  inquiryPaymentStatus: "/payment/api",
};

class FaspayCredit extends Faspay {
  constructor(private config: FaspayConfig) {
    super();
    this.baseUrl = config.isProduction ? baseUrl.prod : baseUrl.dev;
  }

  async createTransaction(data: CreateCreditTxData) {
    if (!data.customer.ipAddress) {
      throw new Error("Customer ipAddress is required.");
    }

    const billTotal =
      data.total || data.items.reduce((a, b) => a + b.price * b.qty, 0);

    const signature = signature2(
      this.config.creditAccount,
      this.config.creditPassword,
      data.billNo,
      idr2(billTotal),
      "0"
    );

    const payload: CreateCreditTxRequest = {
      payment_method: "1",
      merchantid: this.config.creditAccount,
      merchant_tranid: data.billNo,
      pymt_ind: "",
      pymt_criteria: "",
      currencycode: "IDR",
      amount: idr2(billTotal),
      signature,
      custname: data.customer.name,
      custemail: data.customer.email,
      shopper_id: data.customer.ipAddress!,

      description: data.description,
      response_type: ResponseType.HttpPost,

      billing_address: data.billing.address,
      billing_address_city: data.billing.city,
      billing_address_region: data.billing.region,
      billing_address_state: data.billing.state,
      billing_address_poscode: data.billing.postCode,
      billing_address_country_code: data.billing.countryCode,

      receiver_name_for_shipping: data.shipping.name,
      shipping_address: data.shipping.address,
      shipping_address_city: data.shipping.city,
      shipping_address_region: data.shipping.region,
      shipping_address_state: data.shipping.state,
      shipping_address_poscode: data.shipping.postCode,
      shipping_address_country_code: data.shipping.countryCode,

      shippingcost: idr2(data.shipping.cost || 0),
      phone_no: data.customer.phone,
      mparam1: "",
      mparam2: "",
    };

    return this._request<any>(endpoints.createTransaction, payload);
  }

  async getPaymentStatus(trxId: string, billNo: string) {
    // const signature = generateSignature(
    //   this.config.userId,
    //   this.config.password,
    //   billNo
    // );
    // const payload: InquiryPaymentStatusRequest = {
    //   request: "Inquiry Payment Status",
    //   merchant_id: this.config.merchantId,
    //   trx_id: trxId,
    //   bill_no: billNo,
    //   signature,
    // };
    // return this._request<InquiryPaymentStatusResponse>(
    //   endpoints.inquiryPaymentStatus,
    //   payload
    // );
  }
}

export default FaspayCredit;
