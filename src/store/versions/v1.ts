import { Persist, STORE_VER_KEY } from "../context";
import { Code } from "../index";
import { window } from "vscode";
import { encode, decode } from "../crypto";
const KEY = "TOTP";
const STORE_VER = 1;
export const persistV1: Persist = {
  async storeInState(ctx, codes) {
    ctx.globalState.update(KEY, codes);
    ctx.globalState.update(STORE_VER_KEY, STORE_VER);
  },

  async loadFromState(ctx) {
    const value = ctx.globalState.get<Code[] | null>(KEY, null);
    return value === null ? [] : value;
  },

  async backup(ctx, data, passphrase) {
    const value =
      passphrase === ""
        ? { cleartext: data }
        : {
            encrypted: encode(JSON.stringify(data), passphrase),
          };
    const json = JSON.stringify(value, null, 2);
    return json;
  },

  async restore(ctx, backupData, passphraseGetter) {
    let passphrase;
    const { cleartext, encrypted } = JSON.parse(backupData);
    const codes: Code[] = [];
    if (cleartext !== undefined) {
      codes.push(...cleartext);
    }
    if (encrypted !== undefined) {
      passphrase = await passphraseGetter();
      if (!passphrase) {
        throw new Error("No passphrase was supplied");
      }
      codes.push(...JSON.parse(decode(encrypted, passphrase)));
    }

    return codes;
  },
  async clear(ctx): Promise<void> {
    ctx.globalState.update(KEY, null);
    ctx.globalState.update(STORE_VER_KEY, null);
  },
};
