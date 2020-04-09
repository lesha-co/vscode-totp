import { Code } from "./index";
import * as vsc from "vscode";

const KEY = "TOTP";

export const addCode = (ctx: vsc.ExtensionContext, code: Code) => {
  const allKeys = getCodes(ctx);
  const newKeys = [code, ...allKeys];
  ctx.globalState.update(KEY, newKeys);
};

export const getCodes = (ctx: vsc.ExtensionContext) => {
  return ctx.globalState.get<Code[]>(KEY, []);
};

export const merge = (ctx: vsc.ExtensionContext, data: Code[]) => {
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

  ctx.globalState.update(KEY, ctxCodes);
};
