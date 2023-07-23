"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallmentTenor = exports.PaymentStatusCode = exports.PaymentPlan = exports.PaymentType = void 0;
var PaymentType;
(function (PaymentType) {
    PaymentType["FullSettlement"] = "1";
    PaymentType["Installment"] = "2";
    PaymentType["Mixed"] = "3";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
var PaymentPlan;
(function (PaymentPlan) {
    PaymentPlan["FullSettlement"] = "1";
    PaymentPlan["Installement"] = "2";
})(PaymentPlan || (exports.PaymentPlan = PaymentPlan = {}));
var PaymentStatusCode;
(function (PaymentStatusCode) {
    PaymentStatusCode["Unprocessed"] = "0";
    PaymentStatusCode["InProcess"] = "1";
    PaymentStatusCode["Success"] = "2";
    PaymentStatusCode["Reserval"] = "4";
    PaymentStatusCode["NotFound"] = "5";
    PaymentStatusCode["Cancelled"] = "8";
    PaymentStatusCode["Unknown"] = "9";
})(PaymentStatusCode || (exports.PaymentStatusCode = PaymentStatusCode = {}));
var InstallmentTenor;
(function (InstallmentTenor) {
    InstallmentTenor["FullPayment"] = "00";
    InstallmentTenor["ThreeMonths"] = "03";
    InstallmentTenor["SixMonths"] = "06";
    InstallmentTenor["OneYear"] = "12";
})(InstallmentTenor || (exports.InstallmentTenor = InstallmentTenor = {}));
