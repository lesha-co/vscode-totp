import { ExtensionContext, window, workspace } from "vscode";
import { decode, merge } from "../store/context";
import { Code } from "../store/index";

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
    const { encrypted, cleartext } = JSON.parse(data.toString());
    let passphrase;
    let codes: Code[] = [];
    if (cleartext !== undefined) {
      codes = [...codes, ...cleartext];
    }
    if (encrypted !== undefined) {
      passphrase = await window.showInputBox({
        prompt: "Enter password used for encryption",
        password: true,
      });
      if (!passphrase) {
        return;
      }
      codes = [...codes, ...JSON.parse(decode(encrypted, passphrase))];
    }

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
