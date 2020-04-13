import { ExtensionContext, window, workspace } from "vscode";
import { auto } from "../store/versions/auto";

export const totpBackup = async (context: ExtensionContext) => {
  try {
    const codes = await auto.loadFromState(context);
    const content = await auto.backup(context, codes);

    const d = await workspace.openTextDocument({ content });
    window.showTextDocument(d);
    window.showInformationMessage(
      "Save this document somewhere and don't forge the passphrase!"
    );
  } catch (x) {
    // debugger;
  }
};
