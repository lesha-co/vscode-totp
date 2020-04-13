import { Persist, STORE_VER_KEY } from "../context";
import { Code } from "../index";
import { askForEncryptionPassword } from "../askForEncryptionPassword";
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
    return ctx.globalState.get<Code[]>(KEY, []);
  },
  async backup(ctx, data) {
    const passphrase = await askForEncryptionPassword();
    if (passphrase === undefined) {
      throw new Error("passphrase dialog aborted");
    }
    if (passphrase === "") {
      return JSON.stringify({ cleartext: data });
    } else {
      return JSON.stringify({
        encrypted: encode(JSON.stringify(data), passphrase),
      });
    }
  },
  async restore(ctx, backupData) {
    let passphrase;
    const { cleartext, encrypted } = JSON.parse(backupData);
    const codes: Code[] = [];
    if (cleartext !== undefined) {
      codes.push(...cleartext);
    }
    if (encrypted !== undefined) {
      passphrase = await window.showInputBox({
        prompt: "Enter password used for encryption",
        password: true,
      });
      if (!passphrase) {
        throw new Error("No passphrase was supplied");
      }
      codes.push(...JSON.parse(decode(encrypted, passphrase)));
    }

    return codes;
  },
};
