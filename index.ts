import FaspayDebit from "./src/debit";
import FaspayCredit from "./src/credit";
import FaspayError from "./src/error";

export * from "./types/faspay";
export * from "./types/debit";
export * from "./types/credit";

export { FaspayDebit, FaspayCredit, FaspayError };
export default FaspayDebit;
