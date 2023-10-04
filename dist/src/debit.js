"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dayjs_1 = __importDefault(require("dayjs"));
var debit_1 = require("../types/debit");
var utils_1 = require("./utils");
var faspay_1 = __importDefault(require("./faspay"));
var baseUrl = {
    dev: "https://debit-sandbox.faspay.co.id",
    prod: "https://web.faspay.co.id",
};
var endpoints = {
    getPaymentChannel: "/cvr/100001/10",
    postDataTransaction: "/cvr/300011/10",
    inquiryPaymentStatus: "/cvr/100004/10",
    cancelTransaction: "/cvr/100005/10",
};
var FaspayDebit = /** @class */ (function (_super) {
    __extends(FaspayDebit, _super);
    function FaspayDebit(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.baseUrl = config.isProduction ? baseUrl.prod : baseUrl.dev;
        return _this;
    }
    FaspayDebit.prototype.getPaymentChannel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var signature, payload;
            return __generator(this, function (_a) {
                signature = (0, utils_1.generateSignature)(this.config.userId, this.config.password);
                payload = {
                    request: "Request List of Payment Gateway",
                    merchant_id: this.config.merchantId,
                    signature: signature,
                };
                return [2 /*return*/, this._request(endpoints.getPaymentChannel, payload)];
            });
        });
    };
    FaspayDebit.prototype.createTransaction = function (data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __awaiter(this, void 0, void 0, function () {
            var billTotal, signature, payload;
            var _this = this;
            return __generator(this, function (_u) {
                billTotal = data.total || data.items.reduce(function (a, b) { return a + b.price * b.qty; }, 0);
                signature = (0, utils_1.generateSignature)(this.config.userId, this.config.password, data.billNo);
                payload = {
                    request: "Request List of Payment Gateway",
                    merchant: this.config.merchant,
                    merchant_id: this.config.merchantId,
                    signature: signature,
                    bill_no: data.billNo,
                    bill_date: (0, dayjs_1.default)(data.date).format("YYYY-MM-DD HH:mm:ss"),
                    bill_expired: (0, dayjs_1.default)(data.date)
                        .add(data.expired || 24, "hours")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    bill_desc: data.description,
                    bill_currency: "IDR",
                    bill_gross: data.gross ? (0, utils_1.idr)(data.gross) : undefined,
                    bill_miscfee: data.miscFee ? (0, utils_1.idr)(data.miscFee) : undefined,
                    bill_total: (0, utils_1.idr)(billTotal),
                    payment_channel: data.paymentChannel,
                    pay_type: data.paymentType || debit_1.PaymentType.FullSettlement,
                    cust_no: data.customer.no,
                    cust_name: data.customer.name,
                    msisdn: data.customer.phone,
                    email: data.customer.email,
                    terminal: "10",
                    billing_name: (_a = data.billing) === null || _a === void 0 ? void 0 : _a.name,
                    billing_lastname: (_b = data.billing) === null || _b === void 0 ? void 0 : _b.lastName,
                    billing_address: (_c = data.billing) === null || _c === void 0 ? void 0 : _c.address,
                    billing_address_city: (_d = data.billing) === null || _d === void 0 ? void 0 : _d.city,
                    billing_address_region: (_e = data.billing) === null || _e === void 0 ? void 0 : _e.region,
                    billing_address_state: (_f = data.billing) === null || _f === void 0 ? void 0 : _f.state,
                    billing_address_poscode: (_g = data.billing) === null || _g === void 0 ? void 0 : _g.postCode,
                    billing_msisdn: (_h = data.billing) === null || _h === void 0 ? void 0 : _h.msisdn,
                    billing_address_country_code: (_j = data.billing) === null || _j === void 0 ? void 0 : _j.countryCode,
                    receiver_name_for_shipping: (_k = data.shipping) === null || _k === void 0 ? void 0 : _k.name,
                    shipping_lastname: (_l = data.shipping) === null || _l === void 0 ? void 0 : _l.lastName,
                    shipping_address: (_m = data.shipping) === null || _m === void 0 ? void 0 : _m.address,
                    shipping_address_city: (_o = data.shipping) === null || _o === void 0 ? void 0 : _o.city,
                    shipping_address_region: (_p = data.shipping) === null || _p === void 0 ? void 0 : _p.region,
                    shipping_address_state: (_q = data.shipping) === null || _q === void 0 ? void 0 : _q.state,
                    shipping_address_poscode: (_r = data.shipping) === null || _r === void 0 ? void 0 : _r.postCode,
                    shipping_msisdn: (_s = data.shipping) === null || _s === void 0 ? void 0 : _s.msisdn,
                    shipping_address_country_code: (_t = data.shipping) === null || _t === void 0 ? void 0 : _t.countryCode,
                    item: data.items.map(function (item) { return ({
                        id: item.id,
                        product: item.product,
                        amount: (0, utils_1.idr)(item.price),
                        qty: item.qty.toString(),
                        payment_plan: item.paymentPlan || debit_1.PaymentPlan.FullSettlement,
                        merchant_id: item.merchantId || _this.config.merchantId,
                        tenor: item.tenor || debit_1.InstallmentTenor.FullPayment,
                    }); }),
                };
                return [2 /*return*/, this._request(endpoints.postDataTransaction, payload)];
            });
        });
    };
    FaspayDebit.prototype.getPaymentStatus = function (trxId, billNo) {
        return __awaiter(this, void 0, void 0, function () {
            var signature, payload;
            return __generator(this, function (_a) {
                signature = (0, utils_1.generateSignature)(this.config.userId, this.config.password, billNo);
                payload = {
                    request: "Inquiry Payment Status",
                    merchant_id: this.config.merchantId,
                    trx_id: trxId,
                    bill_no: billNo,
                    signature: signature,
                    payment_status_code: "2",
                    payment_status_desc: "Payment Success"
                };
                return [2 /*return*/, this._request(endpoints.inquiryPaymentStatus, payload)];
            });
        });
    };
    FaspayDebit.prototype.cancelTransaction = function (trxId, billNo, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var signature, payload;
            return __generator(this, function (_a) {
                signature = (0, utils_1.generateSignature)(this.config.userId, this.config.password, billNo);
                payload = {
                    request: "Canceling Payment",
                    merchant_id: this.config.merchantId,
                    merchant: this.config.merchant,
                    trx_id: trxId,
                    bill_no: billNo,
                    payment_cancel: reason,
                    signature: signature,
                };
                return [2 /*return*/, this._request(endpoints.cancelTransaction, payload)];
            });
        });
    };
    return FaspayDebit;
}(faspay_1.default));
exports.default = FaspayDebit;
