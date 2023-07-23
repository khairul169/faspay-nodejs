import fetch from "node-fetch";
import { FaspayResponse, ResponseCode } from "../types/faspay";
import FaspayError from "./error";

class Faspay {
  protected baseUrl = "";

  protected async _request<T extends FaspayResponse>(url: string, body?: any) {
    const _url = this.baseUrl + url;
    const response = await fetch(_url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    const data = (await response.json()) as T;

    if (data.response_code !== ResponseCode.Success) {
      throw new FaspayError(data);
    }

    return data;
  }
}

export default Faspay;
