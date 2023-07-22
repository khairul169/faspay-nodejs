"use strict";
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
var node_fetch_1 = __importDefault(require("node-fetch"));
var dayjs_1 = __importDefault(require("dayjs"));
var faspay_1 = require("../types/faspay");
var utils_1 = require("./utils");
var endpoints = {
    GET_PAYMENT_CHANNEL: "/cvr/100001/10",
    POST_DATA_TRANSACTION: "/cvr/300011/10",
    INQUIRY_PAYMENT_STATUS: "/cvr/100004/10",
    CANCEL_TRANSACTION: "/cvr/100005/10",
};
var Faspay = /** @class */ (function () {
    function Faspay(config) {
        this.config = config;
    }
    Faspay.prototype.getPaymentChannel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var signature, payload;
            return __generator(this, function (_a) {
                signature = (0, utils_1.generateSignature)(this.config.userId, this.config.password);
                payload = {
                    request: "Request List of Payment Gateway",
                    merchant_id: this.config.merchantId,
                    signature: signature,
                };
                return [2 /*return*/, this._request(endpoints.GET_PAYMENT_CHANNEL, payload)];
            });
        });
    };
    Faspay.prototype.createTransaction = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var billTotal, signature, payload;
            var _this = this;
            return __generator(this, function (_a) {
                billTotal = data.total || data.items.reduce(function (a, b) { return a + b.price * b.qty; }, 0);
                signature = (0, utils_1.generateSignature)(this.config.userId, this.config.password, data.billNo);
                payload = {
                    request: "Request List of Payment Gateway",
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
                    pay_type: "1",
                    cust_no: data.custId,
                    cust_name: data.custName,
                    msisdn: data.custPhone,
                    email: data.custEmail,
                    terminal: "10",
                    item: data.items.map(function (item) { return ({
                        id: item.id,
                        product: item.product,
                        amount: (0, utils_1.idr)(item.price),
                        qty: item.qty.toString(),
                        payment_plan: faspay_1.PaymentPlan.FullSettlement,
                        merchant_id: _this.config.merchantId,
                    }); }),
                };
                return [2 /*return*/, this._request(endpoints.POST_DATA_TRANSACTION, payload)];
            });
        });
    };
    Faspay.prototype.getPaymentStatus = function (trxId, billNo) {
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
                };
                return [2 /*return*/, this._request(endpoints.INQUIRY_PAYMENT_STATUS, payload)];
            });
        });
    };
    Faspay.prototype.cancelTransaction = function (trxId, billNo, reason) {
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
                return [2 /*return*/, this._request(endpoints.CANCEL_TRANSACTION, payload)];
            });
        });
    };
    Faspay.prototype._request = function (url, body) {
        return __awaiter(this, void 0, void 0, function () {
            var _url, response, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        _url = this.config.baseUrl + url;
                        return [4 /*yield*/, (0, node_fetch_1.default)(_url, {
                                method: "POST",
                                body: JSON.stringify(body),
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.status !== 200) {
                            throw new Error(response.statusText);
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = (_a.sent());
                        if (data.response_code !== faspay_1.ResponseCode.Success) {
                            throw new Error(data.response_desc);
                        }
                        return [2 /*return*/, data];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        throw new Error("Payment gateway error!");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Faspay;
}());
exports.default = Faspay;
