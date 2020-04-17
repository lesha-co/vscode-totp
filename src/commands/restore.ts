import { ExtensionContext, window, workspace } from "vscode";
import { merge, Persist, PassphraseGetter } from "../store/context";

import { auto } from "../store/versions/auto";
const passphraseGetter: PassphraseGetter = async () => {
  const passphrase = await window.showInputBox({
    prompt: "Enter passphrase used for encryption",
    password: true,
  });
  if (passphrase === undefined) {
    return null;
  }
  return passphrase;
};
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
    const codes = await auto.restore(context, backupData, passphraseGetter);

    if (codes.length !== 0) {
      await merge(context, codes);
      window.showInformationMessage(
        `${codes.length} passphrases have been imported`
      );
    }
  } catch (x) {
    window.showErrorMessage(
      `An error occured during decryption: \n${x.message}`
    );
  }
};
