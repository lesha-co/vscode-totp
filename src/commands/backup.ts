import { ExtensionContext, window, workspace } from "vscode";
import { getCodes, encode } from "../store/context";
import { Code } from "../store/index";

export const totpBackup = async (context: ExtensionContext) => {
  const getContent = (passphrase: string, data: Code[]) => {
    if (passphrase === "") {
      return JSON.stringify({ cleartext: data });
    } else {
      return JSON.stringify({
        encrypted: encode(JSON.stringify(data), passphrase),
      });
    }
  };

  try {
    const passphrase = await window.showInputBox({
      prompt: "Enter encryption password",
      password: true,
      placeHolder: "Leave this empty if you don't want to encrypt (UNSAFE)",
    });
    if (passphrase === undefined) {
      return;
    }

    const content = getContent(passphrase, getCodes(context));

    const d = await workspace.openTextDocument({ content });
    window.showTextDocument(d);
    window.showInformationMessage(
      "Save this document somewhere and don't forge the passphrase!"
    );
  } catch (x) {
    // debugger;
  }
};
