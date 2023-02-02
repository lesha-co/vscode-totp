import { getTOTP, SupportedEncodings } from "simple-totp";
import { sideEffects } from "../external";

export type Code = {
  name: string;
  secret: string;
  prefix?: string;
  type: SupportedEncodings | "base32";
  t0: number;
  tx: number;
  nDigits: number;
};

export const getInfo = (code: Code) => {
  const { totp, remainingMs } = getTOTP(
    code.secret,
    code.type,
    sideEffects.timestamp(),
    code.nDigits,
    code.t0,
    code.tx
  );
  const prefix = code.prefix || "";
  const remaining = Math.floor(remainingMs / 1000)
    .toString(10)
    .padStart(2, "0");
  return { code: `${prefix}${totp}`, remaining, name: code.name };
};
