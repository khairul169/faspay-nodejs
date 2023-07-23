import { FaspayResponse, ResponseCode } from "../types/faspay";

class FaspayError extends Error {
  code = ResponseCode.SystemMalfunction;

  constructor(res: FaspayResponse) {
    super(res.response_desc);
    this.code = res.response_code;
    Object.setPrototypeOf(this, FaspayError.prototype);
  }
}

export default FaspayError;
