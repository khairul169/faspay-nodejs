import { expect } from "chai";
import {
  CreateTransactionData,
  PaymentStatusCode,
  ResponseCode,
} from "../types/faspay";
import Faspay from "../src/faspay";

describe("Faspay test", () => {
  let faspay: Faspay;
  let trxId: string;
  let billNo: string;

  before(() => {
    faspay = new Faspay({
      baseUrl: process.env.FASPAY_BASE_URL!,
      merchantId: process.env.FASPAY_MERCHANT_ID!,
      merchant: process.env.FASPAY_MERCHANT!,
      userId: process.env.FASPAY_USER_ID!,
      password: process.env.FASPAY_PASSWORD!,
      creditAccount: process.env.FASPAY_CREDIT_ACCOUNT!,
      creditPassword: process.env.FASPAY_CREDIT_PASS!,
    });
  });

  it("list available payment gateway", async () => {
    const result = await faspay.getPaymentChannel();

    expect(result.response_code).to.eq(ResponseCode.Success);
    expect(result.payment_channel).is.not.empty;
  });

  it("create debit virtual account transaction", async () => {
    const txData: CreateTransactionData = {
      billNo: Date.now().toString(),
      description: "Test faspay payment",
      paymentChannel: "800",
      custId: "3d966130-ad7e-4482-83a9-36e4cd676393",
      custName: "test customer",
      custPhone: "0896959239123",
      custEmail: "cust@mail.com",
      items: [
        {
          id: "29d42612-213c-4c8f-83f2-916e19b6932b",
          product: "Test Product",
          price: 100000,
          qty: 1,
        },
      ],
    };

    const result = await faspay.createTransaction(txData);

    expect(result.response_code).to.eq(ResponseCode.Success);
    expect(result.redirect_url).is.not.empty;

    // store tx data for later test
    trxId = result.trx_id;
    billNo = result.bill_no;
  });

  it("check payment status", async () => {
    const result = await faspay.getPaymentStatus(trxId, billNo);

    expect(result.response_code).to.eq(ResponseCode.Success);
    expect(result.payment_status_code).to.eq(PaymentStatusCode.Unprocessed);
  });

  it("cancel transaction", async () => {
    const result = await faspay.cancelTransaction(
      trxId,
      billNo,
      "cancel tx tests"
    );

    expect(result.response_code).to.eq(ResponseCode.Success);
    expect(result.payment_status_code).to.eq(PaymentStatusCode.Cancelled);
  });
});
