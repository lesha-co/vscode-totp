import { window } from "vscode";
export const askForEncryptionPassword = async () => {
  const passphrase = await window.showInputBox({
    prompt: "Enter encryption password",
    password: true,
    placeHolder: "Leave this empty if you don't want to encrypt (UNSAFE)",
  });
  return passphrase;
};
