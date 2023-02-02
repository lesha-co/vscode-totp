import { Persist, STORE_VER_KEY } from "../context";
import { sideEffects } from "../../external";
import { persistV1 } from "./v1";
import { otpPasswordGetter } from "../passphraseGetter";
const KEY = "TOTP";
const STORE_VER = 2;
export const persistV2: Persist = {
  async storeInState(ctx, codes) {
    const passphrase = await otpPasswordGetter.get();
    if (passphrase === undefined) {
      await sideEffects.showErrorMessage("Can't update storage");
      return;
    }
    ctx.globalState.update(KEY, await this.backup(ctx, codes, passphrase));
    ctx.globalState.update(STORE_VER_KEY, STORE_VER);
  },

  async loadFromState(ctx) {
    const backupData = ctx.globalState.get<string>(KEY, "{}");
    const data = await this.restore(backupData, otpPasswordGetter);
    return data;
  },

  backup: persistV1.backup,
  restore: persistV1.restore,
  clear: persistV1.clear,
};
