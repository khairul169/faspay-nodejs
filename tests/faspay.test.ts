import { assert, expect } from "chai";
import {
  CreateTransactionData,
  InstallmentTenor,
  PaymentStatusCode,
  PaymentType,
} from "../types/debit";
import FaspayDebit from "../src/debit";
import FaspayError from "../src/error";
import { FaspayConfig } from "../types/faspay";

describe("Faspay test", () => {
  let trxId: string;
  let billNo: string;

  const config: FaspayConfig = {
    isProduction: process.env.FASPAY_IS_PRODUCTION === "true",
    merchantId: process.env.FASPAY_MERCHANT_ID!,
    merchant: process.env.FASPAY_MERCHANT!,
    userId: process.env.FASPAY_USER_ID!,
    password: process.env.FASPAY_PASSWORD!,
    creditAccount: process.env.FASPAY_CREDIT_ACCOUNT!,
    creditPassword: process.env.FASPAY_CREDIT_PASS!,
  };

  const faspay = new FaspayDebit(config);

  const transactionSample: CreateTransactionData = {
    billNo: Date.now().toString(),
    description: "Test faspay payment",
    paymentChannel: "800",
    paymentType: PaymentType.FullSettlement,
    customer: {
      no: "3d966130-ad7e-4482-83a9-36e4cd676393",
      name: "test customer",
      phone: "896959239123",
      email: "cust@mail.com",
    },
    billing: {
      // optional (required for OVO)
      name: "John Doe",
      address: "Jl Sabang 37",
      city: "Jakarta",
      region: "DKI Jakarta",
      state: "Indonesia",
      postCode: "10170",
      countryCode: "ID",
    },
    shipping: {
      // optional (required for OVO)
      name: "John Doe",
      address: "Jl Sabang 37",
      city: "Jakarta",
      region: "DKI Jakarta",
      state: "Indonesia",
      postCode: "10170",
      countryCode: "ID",
    },
    items: [
      {
        id: "29d42612-213c-4c8f-83f2-916e19b6932b",
        product: "Test Product",
        price: 100000,
        qty: 1,
        tenor: InstallmentTenor.FullPayment, // optional
      },
    ],
  };

  it("list available payment gateway", async () => {
    const result = await faspay.getPaymentChannel();
    expect(result.payment_channel).is.not.empty;
  });

  it("create debit virtual account transaction", async () => {
    const result = await faspay.createTransaction(transactionSample);
    expect(result.redirect_url).is.not.empty;

    // store tx data for later test
    trxId = result.trx_id;
    billNo = result.bill_no;
  });

  it("check payment status", async () => {
    const result = await faspay.getPaymentStatus(trxId, billNo);
    expect(result.payment_status_code).to.eq(PaymentStatusCode.Unprocessed);
  });

  it("cancel transaction", async () => {
    const result = await faspay.cancelTransaction(
      trxId,
      billNo,
      "cancel tx tests"
    );
    expect(result.payment_status_code).to.eq(PaymentStatusCode.Cancelled);
  });

  it("thrown error if payment channel is not valid", async () => {
    try {
      await faspay.createTransaction({
        ...transactionSample,
        paymentChannel: "123456",
      });
      assert.fail();
    } catch (err) {
      expect(err).to.be.instanceOf(FaspayError);
    }
  });

  it("create debit internet banking transaction", async () => {
    const result = await faspay.createTransaction({
      ...transactionSample,
      paymentChannel: "401",
    });
    expect(result.redirect_url).is.not.empty;
  });

  it("create debit retail transaction", async () => {
    const result = await faspay.createTransaction({
      ...transactionSample,
      paymentChannel: "706",
    });
    expect(result.redirect_url).is.not.empty;
  });

  it("create LinkAja e-wallet transaction", async () => {
    const result = await faspay.createTransaction({
      ...transactionSample,
      paymentChannel: "302",
    });
    expect(result.redirect_url).is.not.empty;
  });

  // broken
  it.skip("create ShopeePay QRIS transaction", async () => {
    const result = await faspay.createTransaction({
      ...transactionSample,
      paymentChannel: "711",
    });
    console.log(result);
    expect(result.redirect_url).is.not.empty;
  });
});
