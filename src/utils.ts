import crypto from "crypto";

/**
 * Utils
 */

export function hash(type: "md5" | "sha1", data: string) {
  return crypto.createHash(type).update(data).digest("hex");
}

export function generateSignature(...data: string[]) {
  const payload = data.join("");
  return hash("sha1", hash("md5", payload));
}

export function idr(num: number) {
  return (Math.round(num) * 100).toString();
}
