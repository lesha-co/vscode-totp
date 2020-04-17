import { ExtensionContext, window } from "vscode";

import { auto } from "../store/versions/auto";

export const totpClear = async (context: ExtensionContext) => {
  try {
    const YES = { label: "Confirm" };

    const items = new Array(10).map((x) => ({ label: "---" }));
    const index = Math.round(Math.random() * 8) + 1;
    items[index] = YES;
    const result = await window.showQuickPick(items);

    if (result === YES) {
      await auto.clear(context);
    }
  } catch (x) {
    // debugger;
  }
};
