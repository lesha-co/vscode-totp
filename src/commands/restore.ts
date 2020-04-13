import { ExtensionContext, window, workspace } from "vscode";
import { merge, Persist } from "../store/context";

import { auto } from "../store/versions/auto";

export const totpRestore = async (context: ExtensionContext) => {
  try {
    const uri = await window.showOpenDialog({
      openLabel: "Restore seeds",
      canSelectMany: false,
      canSelectFiles: true,
    });
    if (!uri) {
      return;
    }
    const data = await workspace.fs.readFile(uri[0]);
    const backupData = data.toString();
    const codes = await auto.restore(context, backupData);

    if (codes.length !== 0) {
      merge(context, codes);
      window.showInformationMessage(
        `${codes.length} passwords have been imported`
      );
    }
  } catch (x) {
    window.showErrorMessage(
      `An error occured during decryption: \n${x.message}`
    );
  }
};
