import * as ui from "../ui";
export const askForEncryptionPassphrase = async () => {
  const passphrase = await ui.showInputBox({
    prompt: "Enter encryption passphrase",
    password: true,
    placeHolder: "Leave this empty if you don't want to encrypt (UNSAFE)",
  });
  return passphrase;
};
