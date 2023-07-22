import { CancelTransactionResponse, CreateTransactionData, CreateTransactionResponse, FaspayConfig, GetPaymentChannelResponse, InquiryPaymentStatusResponse } from "../types/faspay";
declare class Faspay {
    private config;
    constructor(config: FaspayConfig);
    getPaymentChannel(): Promise<GetPaymentChannelResponse>;
    createTransaction(data: CreateTransactionData): Promise<CreateTransactionResponse>;
    getPaymentStatus(trxId: string, billNo: string): Promise<InquiryPaymentStatusResponse>;
    cancelTransaction(trxId: string, billNo: string, reason: string): Promise<CancelTransactionResponse>;
    private _request;
}
export default Faspay;
