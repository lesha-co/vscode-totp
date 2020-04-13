import * as crypto from "crypto";
const EXPORT_ENCODING = "hex";
const ALGORITHM = "aes-192-cbc";

export const encode = (data: string, passphrase: string) => {
  // Use the async `crypto.scrypt()` instead.
  const key = crypto.scryptSync(passphrase, "salt", 24);
  // Use `crypto.randomBytes` to generate a random iv instead of the static iv
  // shown here.
  const iv = Buffer.alloc(16, 0); // Initialization vector.

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(data, "utf8", EXPORT_ENCODING);
  encrypted += cipher.final(EXPORT_ENCODING);
  return encrypted;
};

export const decode = (data: string, passphrase: string) => {
  // Use the async `crypto.scrypt()` instead.
  const key = crypto.scryptSync(passphrase, "salt", 24);
  // Use `crypto.randomBytes` to generate a random iv instead of the static iv
  // shown here.
  const iv = Buffer.alloc(16, 0); // Initialization vector.

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  let decrypted = decipher.update(data, EXPORT_ENCODING, "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
  // Prints: some clear text data
};
