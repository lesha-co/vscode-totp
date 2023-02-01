import { ExtensionContext, workspace } from "vscode";
import { merge, PassphraseGetter } from "../store/context";
import * as ui from "../ui";
import { auto } from "../store/versions/auto";
const passphraseGetter: PassphraseGetter = async () => {
  const passphrase = await ui.showInputBox({
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
    const uri = await ui.showOpenDialog({
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
      ui.showInformationMessage(
        `${codes.length} passphrases have been imported`
      );
    }
  } catch (x) {
    ui.showErrorMessage(
      `An error occured during decryption: \n${(x as Error).message}`
    );
  }
};
