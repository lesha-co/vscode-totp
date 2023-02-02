import { ExtensionContext } from "vscode";
import { merge, PassphraseGetter } from "../store/context";
import { sideEffects } from "../external";
import { auto } from "../store/versions/auto";
const passphraseGetter: PassphraseGetter = async () => {
  const passphrase = await sideEffects.showInputBox({
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
    const uri = await sideEffects.showOpenDialog({
      openLabel: "Restore seeds",
      canSelectMany: false,
      canSelectFiles: true,
    });
    if (!uri) {
      return;
    }
    const data = await sideEffects.fsReadFile(uri[0]);
    const backupData = data.toString();
    const codes = await auto.restore(context, backupData, passphraseGetter);

    if (codes.length !== 0) {
      await merge(context, codes);
      sideEffects.showInformationMessage(
        `${codes.length} passphrases have been imported`
      );
    }
  } catch (x) {
    sideEffects.showErrorMessage(
      `An error occured during decryption: \n${(x as Error).message}`
    );
  }
};
