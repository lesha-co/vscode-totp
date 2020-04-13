import { Code } from "./index";
import { ExtensionContext } from "vscode";
import { auto } from "./versions/auto";
export const STORE_VER_KEY = "STORE_VER";
export interface Persist {
  storeInState(ctx: ExtensionContext, codes: Code[]): Promise<void>;
  loadFromState(ctx: ExtensionContext): Promise<Code[]>;
  backup(ctx: ExtensionContext, codes: Code[]): Promise<string>;
  restore(ctx: ExtensionContext, backupData: string): Promise<Code[]>;
}

export const addCode = async (ctx: ExtensionContext, code: Code) => {
  const allKeys = await auto.loadFromState(ctx);
  const newKeys = [code, ...allKeys];
  await auto.storeInState(ctx, newKeys);
};

export const replaceCode = async (
  ctx: ExtensionContext,
  name: string,
  newCode: Code
) => {
  const allKeys = await auto.loadFromState(ctx);
  const newKeys = allKeys.map((key) => {
    if (key.name === name) {
      return newCode;
    }
    return key;
  });
  await auto.storeInState(ctx, newKeys);
};
export const deleteCode = async (ctx: ExtensionContext, name: string) => {
  const allKeys = await auto.loadFromState(ctx);
  const newKeys = allKeys.filter((key) => key.name !== name);
  await auto.storeInState(ctx, newKeys);
};

export const merge = async (ctx: ExtensionContext, data: Code[]) => {
  const ctxCodes = await auto.loadFromState(ctx);

  data.forEach((code) => {
    const c = ctxCodes.find(
      (ctxCode) => JSON.stringify(ctxCode) === JSON.stringify(code)
    );

    if (c === undefined) {
      console.log(`merging code ${code.name}`);
      ctxCodes.push(code);
    }
  });

  await auto.storeInState(ctx, ctxCodes);
};
