import { FaspayResponse, ResponseCode } from "../types/faspay";
declare class FaspayError extends Error {
    code: ResponseCode;
    constructor(res: FaspayResponse);
}
export default FaspayError;
