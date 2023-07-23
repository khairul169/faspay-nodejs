export type FaspayConfig = {
    isProduction?: boolean;
    merchantId: string;
    merchant: string;
    userId: string;
    password: string;
    creditAccount?: string;
    creditPassword?: string;
};
export type FaspayRequest = {
    request: string;
    merchant_id: string;
    merchant?: string;
    signature: string;
};
export type FaspayResponse = {
    response: string;
    merchant_id: string;
    merchant: string;
    response_code: ResponseCode;
    response_desc: string;
};
export declare enum ResponseCode {
    Success = "00",
    InvalidMerchant = "03",
    InvalidAmount = "13",
    InvalidOrder = "14",
    CancelledByMerchant = "17",
    InvalidCustomer = "18",
    SubscriptionExpired = "21",
    FormatError = "30",
    FunctionNotSupported = "40",
    OrderExpired = "54",
    IncorrectUserOrPassword = "55",
    SecurityViolation = "56",
    NotActiveOrSuspended = "63",
    InternalError = "66",
    PaymentWasReversal = "80",
    AlreadyBeenPaid = "81",
    UnregisteredEntity = "82",
    ParameterIsMandatory = "83",
    UnregisteredParameters = "84",
    InsufficientParameters = "85",
    SystemMalfunction = "96"
}
