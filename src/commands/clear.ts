import { ExtensionContext } from "vscode";
import * as ui from "../ui";
import { auto } from "../store/versions/auto";

export const totpClear = async (context: ExtensionContext) => {
  try {
    const YES = { label: "♻️ CONFIRM PURGE ♻️" };

    const items = new Array(10)
      .fill(0)
      .map((x) => ({ label: "❌ ABORT PURGE ❌" }));
    const index = Math.round(Math.random() * 8) + 1;
    items[index] = YES;
    const result = await ui.showQuickPick(items);

    if (result === YES) {
      await auto.clear(context);
    }
  } catch (x) {
    ui.showInformationMessage((x as Error).message);
  }
};
