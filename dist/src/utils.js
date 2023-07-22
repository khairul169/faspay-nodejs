"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idr = exports.generateSignature = exports.hash = void 0;
var crypto_1 = __importDefault(require("crypto"));
/**
 * Utils
 */
function hash(type, data) {
    return crypto_1.default.createHash(type).update(data).digest("hex");
}
exports.hash = hash;
function generateSignature() {
    var data = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        data[_i] = arguments[_i];
    }
    var payload = data.join("");
    return hash("sha1", hash("md5", payload));
}
exports.generateSignature = generateSignature;
function idr(num) {
    return (Math.round(num) * 100).toString();
}
exports.idr = idr;
