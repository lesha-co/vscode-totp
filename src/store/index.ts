import { getTOTP } from "simple-totp";
export type Code = {
  name: string;
  secret: string;
  prefix?: string;
  type: BufferEncoding | "base32";
  T0: number;
  TX: number;
  nDigits: number;
};

export const getInfo = (code: Code) => {
  const { totp, remainingMs } = getTOTP(
    code.secret,
    code.type,
    undefined,
    code.nDigits,
    code.T0,
    code.TX
  );
  const prefix = code.prefix || "";
  const remaining = Math.floor(remainingMs / 1000)
    .toString(10)
    .padStart(2, "0");
  return { code: `${prefix}${totp}`, remaining, name: code.name };
};
