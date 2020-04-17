import { window } from "vscode";
export const askForEncryptionPassphrase = async () => {
  const passphrase = await window.showInputBox({
    prompt: "Enter encryption passphrase",
    password: true,
    placeHolder: "Leave this empty if you don't want to encrypt (UNSAFE)",
  });
  return passphrase;
};
