import { FaspayResponse } from "../types/faspay";
declare class Faspay {
    protected baseUrl: string;
    protected _request<T extends FaspayResponse>(url: string, body?: any): Promise<T>;
}
export default Faspay;
