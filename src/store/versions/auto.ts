import { Persist, STORE_VER_KEY } from "../context";
import { persistV1 } from "./v1";
const latest = persistV1;
export const auto: Persist = {
  storeInState: latest.storeInState,
  backup: latest.backup,
  async loadFromState(ctx) {
    const v = ctx.globalState.get(STORE_VER_KEY);
    switch (v) {
      case 1:
        return persistV1.loadFromState(ctx);
      default:
        throw new Error("unknown version");
    }
  },
  async restore(ctx, backupData) {
    const v = JSON.parse(backupData)[STORE_VER_KEY];
    switch (v) {
      case 1:
      default:
        return persistV1.restore(ctx, backupData);
    }
  },
};
