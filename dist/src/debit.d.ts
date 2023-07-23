import { FaspayConfig } from "../types/faspay";
import { CancelTransactionResponse, CreateTransactionData, CreateTransactionResponse, GetPaymentChannelResponse, InquiryPaymentStatusResponse } from "../types/debit";
import Faspay from "./faspay";
declare class FaspayDebit extends Faspay {
    private config;
    constructor(config: FaspayConfig);
    getPaymentChannel(): Promise<GetPaymentChannelResponse>;
    createTransaction(data: CreateTransactionData): Promise<CreateTransactionResponse>;
    getPaymentStatus(trxId: string, billNo: string): Promise<InquiryPaymentStatusResponse>;
    cancelTransaction(trxId: string, billNo: string, reason: string): Promise<CancelTransactionResponse>;
}
export default FaspayDebit;
