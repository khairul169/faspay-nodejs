<img src="https://github.com/khairul169/faspay-nodejs/blob/main/assets/faspay-logo.webp?raw=true" height="100" />

# [Faspay](https://faspay.co.id/id/) Unofficial Node.js API

This library is designed to ease the process of integrating users apps with [Faspay](https://faspay.co.id/id/) Payment Gateway service.

Original API docs: https://docs.faspay.co.id/

## Installation

Install `faspay` using npm,

```console
$ npm install faspay
```

or yarn

```console
$ yarn add faspay
```

## Example

```ts
import {
  FaspayDebit,
  FaspayConfig,
  CreateTransactionData,
  PaymentStatusCode,
  InstallmentTenor,
} from "faspay";

const config: FaspayConfig = {
  isProduction: false,
  merchantId: "00000",
  merchant: "Test Faspay Integration",
  userId: "bot000000",
  password: "",
  creditAccount: "faspay_trial",
  creditPassword: "",
};

const faspay = new FaspayDebit(config);

const main = async () => {
  // Get payment channel
  const payment = await faspay.getPaymentChannel();
  console.log("Payment channel:", payment.payment_channel);

  // Post data transaction (Virtual Account)
  const payload: CreateTransactionData = {
    billNo: Date.now().toString(),
    description: "Test faspay payment",
    paymentChannel: "800",
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
  const transaction = await faspay.createTransaction(payload);
  console.log("Transaction:", transaction);

  // Check payment status
  const paymentStatus = await faspay.getPaymentStatus(
    transaction.trx_id,
    transaction.bill_no
  );

  switch (paymentStatus.payment_status_code) {
    case PaymentStatusCode.Unprocessed:
      console.log("Payment status: Not Processed");
      break;
    case PaymentStatusCode.Success:
      console.log("Payment status: Success");
      break;
    case PaymentStatusCode.Cancelled:
      console.log("Payment status: Cancelled");
      break;
    default:
      console.log("Payment status:", paymentStatus);
      break;
  }

  // Cancel transaction
  const cancel = await faspay.cancelTransaction(
    transaction.trx_id,
    transaction.bill_no,
    "cancel tx tests"
  );
  console.log("Cancel transaction:", cancel);
};

main();
```

## Features

- [x] Get Payment Channel
- [x] Create Debit VA Transaction
- [x] Create Debit E-Wallet Transaction
- [x] Create Debit Retail Transaction
- [x] Create Online Debit Transaction
- [x] Create ShopeePay QRIS Transaction
- [ ] Create Credit Transaction
- [x] Cancel Transaction
- [x] Check Transaction Status

If the desired feature is not listed, kindly raise a new issue for it.

## License

This open-source software is distributed under the MIT License. See LICENSE.md

## Contributing

We welcome all kinds of contributions, including code, tests, documentation, bug reports, and new features. Feel free to:

- Send us your feedback.
- Submit bug reports.
- Write or edit documents.
- Help fix bugs or add new features.
