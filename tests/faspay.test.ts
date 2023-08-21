import { assert, expect } from "chai";
import {
  CreateTransactionData,
  InstallmentTenor,
  PaymentStatusCode,
  PaymentType,
} from "../types/debit";
import FaspayDebit from "../src/debit";
import FaspayCredit from "../src/credit";
import FaspayError from "../src/error";
import { FaspayConfig } from "../types/faspay";
import { CreateCreditTxData } from "../types/credit";

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
  const credit = new FaspayCredit(config);

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
      name: "John Doe",
      address: "Jl Sabang 37",
      city: "Jakarta",
      region: "DKI Jakarta",
      state: "Indonesia",
      postCode: "10170",
      countryCode: "ID",
    },
    shipping: {
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
    // console.log(result);
    /*
    { pg_code: '707', pg_name: 'ALFAGROUP' },
    { pg_code: '702', pg_name: 'BCA Virtual Account' },
    { pg_code: '801', pg_name: 'BNI Virtual Account' },
    { pg_code: '401', pg_name: 'BRI E-PAY' },
    { pg_code: '800', pg_name: 'BRI Virtual Account' },
    { pg_code: '700', pg_name: 'CIMB Clicks' },
    { pg_code: '819', pg_name: 'DANA' },
    { pg_code: '701', pg_name: 'DANAMON ONLINE BANKING' },
    { pg_code: '708', pg_name: 'Danamon VA' },
    { pg_code: '302', pg_name: 'LinkAja' },
    { pg_code: '802', pg_name: 'Mandiri Virtual Account' },
    { pg_code: '408', pg_name: 'Maybank Virtual Account' },
    { pg_code: '812', pg_name: 'OVO' },
    { pg_code: '706', pg_name: 'Payment Point Indomaret' },
    { pg_code: '402', pg_name: 'Permata' },
    { pg_code: '711', pg_name: 'ShopeePay QRIS' }
    */
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

  it("create OVO e-wallet transaction", async () => {
    const result = await faspay.createTransaction({
      ...transactionSample,
      paymentChannel: "812",
    });
    expect(result.redirect_url).is.not.empty;
  });

  it("create DANA e-wallet transaction", async () => {
    const result = await faspay.createTransaction({
      ...transactionSample,
      paymentChannel: "819",
    });
    expect(result.redirect_url).is.not.empty;
  });

  it("create ShopeePay QRIS transaction", async () => {
    const result = await faspay.createTransaction({
      ...transactionSample,
      paymentChannel: "711",
    });
    expect(result.redirect_url).is.not.empty;
  });

  it.only("create credit card transaction", async () => {
    const payload = {
      ...transactionSample,
      customer: { ...transactionSample.customer, ipAddress: "127.0.0.1" },
      shipping: { ...transactionSample.shipping, cost: 0 },
    } as CreateCreditTxData;

    const result = await credit.createTransaction(payload);
    console.log(result);
    // expect(result.redirect_url).is.not.empty;
  });
});
