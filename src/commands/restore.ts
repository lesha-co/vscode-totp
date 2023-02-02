import { ExtensionContext } from "vscode";
import { merge } from "../store/context";
import { sideEffects } from "../external";
import { auto } from "../store/versions/auto";
import { PassphraseGetterClass } from "../store/passphraseGetter";

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
    const codes = await auto.restore(
      backupData,
      new PassphraseGetterClass("Enter passphrase used for encryption")
    );

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
