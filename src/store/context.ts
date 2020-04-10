import { Code } from "./index";
import { ExtensionContext } from "vscode";
import * as crypto from "crypto";

const KEY = "TOTP";
const STORE_VER = 1;
const STORE_VER_KEY = "STORE_VER";
const EXPORT_ENCODING = "hex";
const ALGORITHM = "aes-192-cbc";
export const getCodes = (ctx: ExtensionContext) => {
  return ctx.globalState.get<Code[]>(KEY, []);
};

export const setCodes = (ctx: ExtensionContext, codes: Code[]) => {
  ctx.globalState.update(KEY, codes);
  ctx.globalState.update(STORE_VER_KEY, STORE_VER);
};

export const addCode = (ctx: ExtensionContext, code: Code) => {
  const allKeys = getCodes(ctx);
  const newKeys = [code, ...allKeys];
  setCodes(ctx, newKeys);
};

export const replaceCode = (
  ctx: ExtensionContext,
  name: string,
  newCode: Code
) => {
  const allKeys = getCodes(ctx);
  const newKeys = allKeys.map((key) => {
    if (key.name === name) {
      return newCode;
    }
    return key;
  });
  setCodes(ctx, newKeys);
};
export const deleteCode = (ctx: ExtensionContext, name: string) => {
  const allKeys = getCodes(ctx);
  const newKeys = allKeys.filter((key) => key.name !== name);
  setCodes(ctx, newKeys);
};

export const merge = (ctx: ExtensionContext, data: Code[]) => {
  const ctxCodes = getCodes(ctx);

  data.forEach((code) => {
    const c = ctxCodes.find(
      (ctxCode) => JSON.stringify(ctxCode) === JSON.stringify(code)
    );

    if (c === undefined) {
      console.log(`merging code ${code.name}`);
      ctxCodes.push(code);
    }
  });

  setCodes(ctx, ctxCodes);
};

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
