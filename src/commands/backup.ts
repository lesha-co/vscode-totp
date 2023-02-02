import { ExtensionContext } from "vscode";
import { auto } from "../store/versions/auto";
import { askForEncryptionPassphrase } from "../store/askForEncryptionPassphrase";
import { sideEffects } from "../external";
export const totpBackup = async (context: ExtensionContext) => {
  try {
    const codes = await auto.loadFromState(context);
    const passphrase = await askForEncryptionPassphrase();
    if (passphrase === undefined) {
      throw new Error("passphrase dialog aborted");
    }
    const content = await auto.backup(context, codes, passphrase);

    const d = await sideEffects.openTextDocument({ content, language: "json" });

    sideEffects.showTextDocument(d);
    sideEffects.showInformationMessage(
      "Save this document somewhere and don't forget the passphrase!"
    );
  } catch (x) {
    // debugger;
  }
};
