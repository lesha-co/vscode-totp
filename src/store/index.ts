import { getTOTP } from "simple-totp";
import { data } from "./data";
export type Code = {
  name: string;
  secret: string;
  prefix?: string;
  type: BufferEncoding | "base32";
  T0: number;
  TX: number;
  nDigits: number;
};

export const getNames = () => {
  return data.map((d) => d.name);
};

export const getCodeByName = (name: string): Code | undefined => {
  return data.find((x) => x.name === name);
};

export const getInfo = (code: Code) => {
  const { totp, remainingSeconds } = getTOTP(
    code.secret,
    code.type,
    undefined,
    code.nDigits,
    code.T0,
    code.TX
  );
  const prefix = code.prefix || "";
  const remaining = Math.floor(remainingSeconds / 1000)
    .toString(10)
    .padStart(2, "0");
  return { code: `${prefix}${totp}`, remaining };
};

export const addCode = (code: Code) => {
  data.push(code);
};
