import { ExtensionContext, window, workspace } from "vscode";
import { auto } from "../store/versions/auto";
import { askForEncryptionPassphrase } from "../store/askForEncryptionPassphrase";

export const totpBackup = async (context: ExtensionContext) => {
  try {
    const codes = await auto.loadFromState(context);
    const passphrase = await askForEncryptionPassphrase();
    if (passphrase === undefined) {
      throw new Error("passphrase dialog aborted");
    }
    const content = await auto.backup(context, codes, passphrase);

    const d = await workspace.openTextDocument({ content, language: "json" });

    window.showTextDocument(d);
    window.showInformationMessage(
      "Save this document somewhere and don't forget the passphrase!"
    );
  } catch (x) {
    // debugger;
  }
};
