import { Persist, STORE_VER_KEY } from "../context";
import { persistV1 } from "./v1";
import { persistV2 } from "./v2";
const latest = persistV2;
export const auto: Persist = {
  storeInState: latest.storeInState,
  backup: latest.backup,
  clear: latest.clear,
  async loadFromState(ctx) {
    const v = ctx.globalState.get(STORE_VER_KEY);
    switch (v) {
      case 2:
        return await persistV2.loadFromState(ctx);
      case 1:
      default:
        return await persistV1.loadFromState(ctx);
    }
  },
  async restore(backupData, passphraseGetter) {
    const v = JSON.parse(backupData)[STORE_VER_KEY];
    switch (v) {
      case 2:
        return await persistV2.restore(backupData, passphraseGetter);
      case 1:
      default:
        return await persistV1.restore(backupData, passphraseGetter);
    }
  },
};
