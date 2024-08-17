import crypto from "node:crypto";

export function createHashString(data: string, length: number = 16): string {
  // Create a SHA-256 hash of the URL
  const hash = crypto.createHash("sha256").update(data).digest("hex");

  // Return the first `length` characters of the hash
  return hash.substring(0, length);
}
