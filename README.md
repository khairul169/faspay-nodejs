<img src="assets/faspay-logo.webp?raw=true" height="100" />

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

## Usage

First, import the Faspay class.

```ts
import Faspay from "faspay";
```

or if you are still using commonjs type module, do this instead:

```js
const { Faspay } = require("faspay");
```

and then create an instance of the object using your Faspay credentials

```ts
const faspay = new Faspay({
  baseUrl: "https://debit-sandbox.faspay.co.id",
  merchantId: "00000",
  merchant: "Test Faspay Integration",
  userId: "bot000000",
  password: "",
  creditAccount: "faspay_trial",
  creditPassword: "",
});
```

During the development or testing phase of the API, configure the baseUrl as https://debit-sandbox.faspay.co.id.

However, when moving to a production environment, set it to https://web.faspay.co.id.

## Example

```ts
import Faspay, { CreateTransactionData, PaymentStatusCode } from "faspay";

const faspay = new Faspay({
  baseUrl: "https://debit-sandbox.faspay.co.id",
  merchantId: "00000",
  merchant: "Test Faspay Integration",
  userId: "bot000000",
  password: "",
  creditAccount: "faspay_trial",
  creditPassword: "",
});

const main = async () => {
  // Get payment channel
  const payment = await faspay.getPaymentChannel();
  console.log("Payment channel:", payment.payment_channel);

  // Post data transaction (Virtual Account)
  const payload: CreateTransactionData = {
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
  const transaction = await faspay.createTransaction(payload);
  console.log("Transaction:", transaction);

  // Check payment status
  const paymentStatus = await faspay.getPaymentStatus(
    transaction.trx_id,
    transaction.bill_no
  );

  switch (paymentStatus.payment_status_code) {
    case PaymentStatusCode.Unprocessed:
    case PaymentStatusCode.InProcess:
      console.log("Payment status: In Process");
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

## License

This open-source software is distributed under the MIT License. See LICENSE.md

## Contributing

We welcome all kinds of contributions, including code, tests, documentation, bug reports, and new features. Feel free to:

- Send us your feedback.
- Submit bug reports.
- Write or edit documents.
- Help fix bugs or add new features.
