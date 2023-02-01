import { ExtensionContext } from "vscode";
import { auto } from "../store/versions/auto";
import { askForEncryptionPassphrase } from "../store/askForEncryptionPassphrase";
import * as ui from "../ui";
export const totpBackup = async (context: ExtensionContext) => {
  try {
    const codes = await auto.loadFromState(context);
    const passphrase = await askForEncryptionPassphrase();
    if (passphrase === undefined) {
      throw new Error("passphrase dialog aborted");
    }
    const content = await auto.backup(context, codes, passphrase);

    const d = await ui.openTextDocument({ content, language: "json" });

    ui.showTextDocument(d);
    ui.showInformationMessage(
      "Save this document somewhere and don't forget the passphrase!"
    );
  } catch (x) {
    // debugger;
  }
};
