import { PassphraseGetter } from "./context";
import { window } from "vscode";

export const makePasswordCache: () => PassphraseGetter = () => {
  let passphrase: string | null = null;
  return async () => {
    if (passphrase) {
      return passphrase;
    }

    const input = await window.showInputBox({
      prompt: "Enter passphrase to unlock OTP storage",
    });

    if (input) {
      passphrase = input;
    }

    return passphrase;
  };
};
